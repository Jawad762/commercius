import { PrefetchOptions } from "@reduxjs/toolkit/query"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { REST_API } from "./API/centralAPI"

type EndpointNames = keyof typeof REST_API.endpoints

export function usePrefetchImmediately<T extends EndpointNames>(
    endpoint: T,
    arg: Parameters<(typeof REST_API.endpoints)[T]['initiate']>[0],
    options: PrefetchOptions = {},
  ) {
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(REST_API.util.prefetch(endpoint, arg as any, options) as any)
    }, [])
}