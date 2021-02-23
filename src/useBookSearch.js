import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([]) //clean data in each look up
  }, [query])


  useEffect(() => {
    setLoading(true) //show mesage loading
    setError(false)//
    let cancel //canceltoken in order to have only one request to API 
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber }, //api documentation 
      cancelToken: new axios.CancelToken(c => cancel = c) // set the canceltoken to cancel
    }).then(res => { 
      setBooks(prevBooks => {
        return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]//add the new data with the old one
      })
      setHasMore(res.data.docs.length > 0) //there are not more books 
      setLoading(false) 
    }).catch(e => {//each time that we cancel the request we get a error(Uncaught error Promise)
      if (axios.isCancel(e)) return //tell to axios to ignore each time we cancel
      setError(true)//if there is a error with the API
    })
    return () => cancel() //this fill cancel the request 
  }, [query, pageNumber])

  return { loading, error, books, hasMore } //return all data 
}
