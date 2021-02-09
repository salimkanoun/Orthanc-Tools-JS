module.exports = [
    {
        id : "uuid",
        type: "retrieve",
        creator: "creator",
        progress: {
            validation : 50,
            retrieve : 0
        },
        state : 'validation',
        content: {
            projectName : "name",
            isValidated : 'Validating',
            items : [
                {
                    AnswerNumber: 3,
                    Validated : false,
                    Status : "waiting"
                },
                {
                    Validated : false,
                    Status : "waiting"
                },
                {
                    Validated : true,
                    Status : "waiting"
                },
            ]
        }
    },
    {
        id : "uuid",
        type: "retrieve",
        creator: "creator",
        progress: {
            validation : 100,
            retrieve : 25
        },
        state : 'retrieve',
        content: {
            projectName : "name",
            isValidated : 'Validated',
            items : [
                {
                    Validated : true,
                    Status : "wait"
                },
                {
                    Validated : true,
                    Status : "active"
                },
            ]
        }
    },
    {
        id : "uuid",
        type: "retrieve",
        creator: "creator",
        progress: {
            validation : 100,
            retrieve : 100
        },
        state : 'completed',
        content: {
            projectName : "name",
            isValidated : 'Validated',
            items : [
                {
                    Validated : true,
                    Status : "completed"
                },
                {
                    Validated : true,
                    Status : "completed"
                },
            ]
        }
    },
    {
        id : "other uuid",
        type: "retrieve",
        creator: "creator",
        progress: {
            validation : 50,
            retrieve : 0
        },
        state : 'validation',
        content: {
            projectName : "name",
            isValidated : 'Validating',
            items : [
                {
                    Validated : false,
                    Status : "waiting"
                },
            ]
        }
    }
]