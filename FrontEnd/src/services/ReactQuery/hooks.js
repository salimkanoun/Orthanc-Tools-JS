import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useCustomQuery = (queryKey, queryFn, onError = undefined, select = undefined, onSuccess = undefined, refetchInterval = undefined, refetchOnWindowFocus = false, enabled = true) => {
    return useQuery(
        queryKey,
        queryFn,
        {
            cacheTime: 0,
            retry: false,
            onError: onError,
            select: select,
            onSuccess: onSuccess,
            refetchInterval: refetchInterval,
            refetchOnWindowFocus: refetchOnWindowFocus,
            enabled: enabled
         }
    )
}


export const useCustomMutation = (mutationFn, invalidateQueryKeys = [], onSuccess = undefined, onError = undefined) => {
    const queryClient = useQueryClient()

    return useMutation(
        mutationFn,
        {
            cacheTime: 0,
            retry: false,
            onSuccess: (data) => {
                invalidateQueryKeys.forEach((keys) => {
                    queryClient.invalidateQueries(keys)
                })
                if (onSuccess) onSuccess(data)
            },
            onError: onError
        }
    )

}