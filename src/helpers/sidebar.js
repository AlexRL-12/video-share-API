import Stats from "./stats";
import Videos from "./video";
import Comments from "./comments";

export default async (viewModel) => {
  const results = await Promise.all([
    Stats(),
    Videos.popular(),
    Comments.newest(),
  ]);

  viewModel.sidebar = {
    stats: results[0],
    popular: results[1],
    comments: results[2],
  };

  return viewModel;
};
