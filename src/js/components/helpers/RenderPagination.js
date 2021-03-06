import _ from "lodash";
import React from "react";

/// Render pagination
export function renderPagination(currentPage, perPage, usersCount, handleClickPage, maxPages,minPagesAtStartAndEnd, minPagesOnEachSide) {
    maxPages = maxPages ? maxPages: 12;
    minPagesOnEachSide= minPagesOnEachSide? minPagesOnEachSide : 2;
    minPagesAtStartAndEnd = minPagesAtStartAndEnd ? minPagesAtStartAndEnd : 3;

    let totalPages = _.ceil(usersCount/perPage);
    let paginationPageNumbers = getPageNumbers(currentPage, totalPages, maxPages, minPagesAtStartAndEnd, minPagesOnEachSide);
    let renderedPageNumbers = renderPageNumbers(paginationPageNumbers, currentPage,totalPages);
    let prevPage = renderPrevPage(currentPage);
    let nextPage = renderNextPage(currentPage,totalPages);

    return (
      <div className="user pagination">
        <ul onClick={handleClickPage}>
          {prevPage}
          {renderedPageNumbers}
          {nextPage}
        </ul>
    </div>)
}

/// Get the Page Numbers to display
const getPageNumbers = function(currentPage, totalPages, maxPages, minPagesAtStartAndEnd, minPagesOnEachSide) {
    let pageNumbers = [];

    if(totalPages<=maxPages) {
      for(let i=1; i<=totalPages; i++) {
          pageNumbers.push(i);
      }
    } else if (totalPages>maxPages) {
      for(let i=1;i<=minPagesAtStartAndEnd;i++) {
        pageNumbers.push(i);
        pageNumbers.push(totalPages+1-i);
      }

      // add entries
      for(let i=currentPage-minPagesOnEachSide; i<=currentPage+minPagesOnEachSide; i++) {
        if(i>0) {
          pageNumbers.push(i);
        }
      }

      pageNumbers = _.uniq(pageNumbers);

      let numbersOnEachSide = _.floor((maxPages-pageNumbers.length));

      let BottomSide = _.filter(pageNumbers,(pn) => { return pn < _.floor(totalPages/2);  });
      let TopSide = _.filter(pageNumbers,(pn) => { return pn > _.floor(totalPages/2);  });

      for(let i=1; i<maxPages && pageNumbers.length+(i-1)*2<=maxPages; i++) {
        BottomSide.push(_.max(BottomSide)+1);
        TopSide.push(_.min(TopSide)-1);
      }

      pageNumbers =_.uniq(_.concat(pageNumbers,BottomSide,TopSide));
    }

    return pageNumbers;
};

/// Render the Page Numbers
const renderPageNumbers = function(pageNumbers, currentPage, totalPages) {
  let renderedPageNumbers = [];
  let dotdotdot= false;
  let dotdotdotNumber = 0;

    for(let i=1; i<=totalPages; i++) {
      if(_.some(pageNumbers,(pn) => {return pn===i;})) {
        dotdotdot=false;
        let pageNumber =null;
        
        if(i===currentPage) {
          pageNumber = <li key={i} className="current-page"><a data-page={i}>{i}</a></li>;
        } else {
          pageNumber = <li key={i} className="other-page"><a data-page={i}>{i}</a></li>;
        }

        renderedPageNumbers.push(pageNumber);
      } else if(dotdotdot===false) {
        dotdotdot=true;
        dotdotdotNumber++;
        renderedPageNumbers.push(<li className="dotdotdot-page" key={'dotdotdot'+dotdotdotNumber}>...</li>);
      }
    }

  return renderedPageNumbers;
};

/// Render the Prev Page button
const renderPrevPage = function(currentPage) {
  const prevPageText = "Prev Page";
  let prevPage = <li className="prev-page disabled" key={-1}>{prevPageText}</li>;

  if(currentPage>1) {
    const prevPageNumber = currentPage-1;
    prevPage = <li className="prev-page" key={-1}><a  data-page={prevPageNumber}>{prevPageText}</a></li>
  }

  return prevPage;
};

/// Render the Next Page button
const renderNextPage = function(currentPage,totalPages) {
  const nextPageText = "Next Page";

  let nextPage = <li className="next-page disabled" key={-2}>{nextPageText}</li>;

  if(currentPage<totalPages) {
    const nextPageNumber = currentPage+1;
    nextPage = <li className="next-page" key={-2}><a  data-page={nextPageNumber}>{nextPageText}</a></li>
  }

  return nextPage;
};

