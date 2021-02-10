module.exports = [
    {
        id : "uuid",
        type: "export",
        creator: "creator",
        progress: {
            archiving : 20,
            sending : 0
        },
        state : 'archiving',
        content: {}
    },
    {
        id : "uuid",
        type: "export",
        creator: "creator",
        progress: {
            archiving : 100,
            sending : 20
        },
        state : 'sending',
        content: {}
    },
    {
        id : "uuid2",
        type: "export",
        creator: "creator2",
        progress: {
            archiving : 20,
            sending : 0
        },
        state : 'archiving',
        content: {}
    },
    {
        id : "uuid",
        type: "export",
        creator: "creator",
        progress: {
            archiving : 100,
            sending : 100
        },
        state : 'completed',
        content: {}
    },
    {
        id : "uuid",
        type: "export",
        creator: "creator",
        progress: {
            archiving : 20,
            sending : 100
        },
        state : 'failed',
        content: {}
    }
]