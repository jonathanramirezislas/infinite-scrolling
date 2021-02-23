import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)

  const observer = useRef() //persist the ref in each render 
  const lastBookElementRef = useCallback(node => { //node is the last book in the list 
    if (loading) return //if the data is loading 
    if (observer.current) observer.current.disconnect() //desconect from the last one book 'cause we have a new last book
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) { //is visisble and are more books
        console.log('last element is visisble on the screen')
        setPageNumber(prevPageNumber => prevPageNumber + 1) //we change the page and useBookSearch will return the new book
      }
    })
    if (node) observer.current.observe(node)//if we have a node we want to observe that node
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value) 
    setPageNumber(1) //in each new query(look up) we wants start in the first page
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) { //get the ref the last book
          return <div ref={lastBookElementRef} key={book}>{book}</div>
        } else { 
          return <div key={book}>{book}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  )
}

