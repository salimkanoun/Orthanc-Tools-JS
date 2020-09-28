function OutgoingFindRequestFilter(query, modality)
    PrintRecursive(query)
    PrintRecursive(modality)
    --rewritePatientID
    --query['0010,0020'] = "newPatientID"
    --map studyDescription to Requested procedure description
    --query['0032,1060'] = query['0008,1030']
    --query['0008,1030'] = nil
    --PrintRecursive(query)

    return query
end
