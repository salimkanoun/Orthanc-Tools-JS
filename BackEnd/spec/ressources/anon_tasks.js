module.exports = [
    {
        id : "uuid",
        type: "anonymize",
        creator: "creator",
        progress: 15,
        state : 'active',
        content: {
            items : [
                {
                    source : 'source1',
                    state : 'active',
                    result : null
                },
                {
                    source : 'source2',
                    state : 'active',
                    result : null
                }
            ]
        }
    },
    {
        id : "uuid",
        type: "anonymize",
        creator: "creator",
        progress: 20,
        state : 'active',
        content: {
            items : [
                {
                    source : 'source1',
                    state : 'active',
                    result : null
                }
            ]
        }
    },
    {
        id : "uuid",
        type: "anonymize",
        creator: "creator",
        progress: 55,
        state : 'active',
        content: {
            items : [
                {
                    source : 'source1',
                    state : 'completed',
                    result : 'new id'
                },
                {
                    source : 'source2',
                    state : 'active',
                    result : null
                }
            ]
        }
    },
    {
        id : "not uuid",
        type: "anonymize",
        creator: "not creator",
        progress: 10,
        state : 'active',
        content: {
            items : [
                {
                    source : 'source2',
                    state : 'active',
                    result : null
                } 
            ]
        }
    }
]