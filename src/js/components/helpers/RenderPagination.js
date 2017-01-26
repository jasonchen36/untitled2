import _ from "lodash";
import React from "react";

/// Render pagination
export function renderPagination(currentPage, perPage, usersCount, handleClickPage, maxPages,minPagesOnEachSide) {
    maxPages = maxPages ? maxPages: 8;
    minPagesOnEachSide= minPagesOnEachSide? minPagesOnEachSide : 2;

     let totalPages = _.ceil(usersCount/perPage);

    let paginationPageNumbers = getPageNumbers(currentPage, totalPages, maxPages, minPagesOnEachSide);
    let renderedPageNumbers = renderPageNumbers(paginationPageNumbers, currentPage,totalPages);
    let prevPage = renderPrevPage(currentPage);
    let nextPage = renderNextPage(currentPage,maxPages);


    return (
      <div>Pages:
    <ul onClick={handleClickPage}>
      {prevPage}
      {renderedPageNumbers}
      {nextPage}
    </ul>
    </div>)
}

const getPageNumbers = function(currentPage, totalPages, maxPages, minPagesOnEachSide) {
    let pageNumbers = [];

    if(totalPages<=maxPages) {
      for(let i=1; i<totalPages; i++) {
          pageNumbers.push(i);
      }
    } else if (totalPages>maxPages) {
      for(let i=1;i<=minPagesOnEachSide;i++) {
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

const renderPageNumbers = function(pageNumbers, currentPage, totalPages) {
  let renderedPageNumbers = [];
  let dotdotdot= false;

    for(let i=1; i<=totalPages; i++) {
      if(_.some(pageNumbers,(pn) => {return pn===i;})) {
        dotdotdot=false;
        let pageNumber =null;
        
        if(i===currentPage) {
          pageNumber = <li key={i}>C<a class="current-page" data-page={i}>{i}</a></li>;
        } else {
          pageNumber = <li key={i}><a data-page={i}>{i}</a></li>;
        }

        renderedPageNumbers.push(pageNumber);
      } else if(dotdotdot===false) {
        dotdotdot=true;
        renderedPageNumbers.push(<li>...</li>);
      }
    }

  return renderedPageNumbers;

};


const renderPrevPage = function(currentPage) {
  const prevPageText = "Prev Page";
  let prevPage = <li><a class="grey">{prevPageText}</a></li>;

  if(currentPage>1) {
    const prevPageNumber = currentPage-1;
    prevPage = <li><a  data-page={prevPageNumber}>{prevPageText}</a></li>
  }

  return prevPage;
};

const renderNextPage = function(currentPage,maxPages) {
  const nextPageText = "Next Page";

  let nextPage = <li>< a class="grey">{nextPageText}</a></li>;

  if(currentPage<maxPages) {
    const nextPageNumber = currentPage+1;
    nextPage = <li><a  data-page={nextPageNumber}>{nextPageText}</a></li>
  }

  return nextPage;
};

