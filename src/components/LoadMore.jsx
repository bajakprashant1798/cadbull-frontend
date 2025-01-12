import React from "react";
import Icons from "./Icons";
const LoadMoreProps = {
  currentPage: 0,
  totalPage: 0,
  loadMoreHandler: () => {},
};

export default function LoadMore({
  currentPage,
  totalPage,
  loadMoreHandler,
} = LoadMoreProps) {
  const showLoadMore = currentPage < totalPage;
  return showLoadMore ? (
    <div className="d-flex justify-content-center mt-5">
         <button
      onClick={loadMoreHandler}
      type="button"
      className="btn-primary-split"
    >
      <span>
        <Icons.Reload />
      </span>
      <span>Load More</span>
    </button>
    </div>
  ) : null;
}
