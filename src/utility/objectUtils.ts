type cb<T> = (data: T) => string;
export const selectConverter = <T extends object>(data: Array<T>, idCb: cb<T>, labelCb: cb<T> ) => {
    return data.map((e)=>{
        return {
            id: idCb(e),
            label: labelCb(e)
        }
    })
}
export const isEmptyObject = (data: object) => {
    if (!data) return true
    else return Object.entries(data)?.length ? false : true
}