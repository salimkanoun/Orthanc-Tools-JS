import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useCustomQuery = (queryKey, queryFn, onError = undefined, select =undefined, onSuccess = undefined, refetchInterval = false) => {
    return useQuery(
        queryKey,
        queryFn,
        {
            cacheTime : 0,
            retry : false,
            onError : onError,
            select : select,
            onSuccess : onSuccess , 
            refetchInterval : refetchInterval 
         }
      )
}


export const useCustomMutation = (mutationFn, invalidateQueryKeys = [], onSuccess =undefined, onError = undefined) => {
    const queryClient = useQueryClient()

    return useMutation(
        mutationFn,
        {
            cacheTime : 0,
            retry : false,
            onSuccess : () => {
                invalidateQueryKeys.forEach((keys) => {
                    queryClient.invalidateQueries(keys)
                })
                if (onSuccess) onSuccess()
            },
            onError : onError
        }
    )

}