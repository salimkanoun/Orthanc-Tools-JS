import { showSaveFilePicker } from 'native-file-system-adapter'

export const exportFileThroughFilesystemAPI = async (
    readableStream,
    mimeType,
    suggestedName,
    showProgress,
    abortController = { abort: () => { } }
) => {
    let acceptedTypes = []

    let extension = suggestedName.split('.').pop()
    acceptedTypes.push({ accept: { [mimeType]: ['.' + extension] } })

    const fileHandle = await showSaveFilePicker({
        _preferPolyfill: true,
        suggestedName: suggestedName,
        types: acceptedTypes,
        excludeAcceptAllOption: false // default
    }).catch((err) => console.log(err))

    let writableStream = await fileHandle.createWritable()

    if (showProgress) {
        let loaded = 0
        /*
        let toastId = toast.info('Download Progress', {
            closeButton: true
        })

        const unsubscribe = toast.onChange((payload) => {
            if (payload.status === 'removed' && payload.id === toastId) {
                abortController.abort()
            }
        })
        */

        let progress = new TransformStream({
            transform(chunk, controller) {
                loaded += chunk.length
                let progressMb = Math.round(loaded / 1000000)
                if (progressMb > 1) {
                    /*
                    toast.update(toastId, {
                        render: 'Download Progress ' + progressMb + ' Mb'
                    })
                    */
                }
                controller.enqueue(chunk)
            }
        })
        await readableStream.pipeThrough(progress).pipeTo(writableStream)
        //unsubscribe()
    } else {
        await readableStream.pipeTo(writableStream)
    }
}