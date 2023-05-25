import { Video, Comment } from "../models";

export const like = async (req, res) => {
  const video = await Video.findById(req.params.video_id);
  console.log(video);
  if (video) {
    video.likes = video.likes + 1;
    await video.save();
    res.json({ likes: video.likes });
  } else {
    res.status(500).json({ error: "Internal Error" });
  }
};

export const comment = async (req, res) => {
  const video = await Video.findById(req.params.video_id);

  if (video) {
    const { name, email, comment } = req.body;

    // Validar el formato del correo electrónico
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Correo electrónico inválido" });
    }

    const newComment = new Comment({
      name,
      email,
      comment,
      video_id: video._id,
    });

    try {
      const savedComment = await newComment.save();
      res
        .status(201)
        .json({
          message: "Comentario creado exitosamente",
          comment: savedComment,
        });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el comentario" });
    }
  } else {
    res.status(404).json({ error: "Video no encontrado" });
  }
};

export const getPopularVideos = async (req, res) => {
  try {
    const averageLikes = await Video.aggregate([
      {
        $group: {
          _id: null,
          avgLikes: { $avg: "$likes" },
        },
      },
    ]);

    if (averageLikes.length === 0) {
      res.status(404).json({ error: "No se encontraron videos" });
      return;
    }

    const videos = await Video.find({
      likes: { $gt: averageLikes[0].avgLikes },
      private: { $ne: true },
    })
      .sort({ likes: -1 })
      .limit(10);

    res.json({ videos });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los videos con más likes" });
  }
};
