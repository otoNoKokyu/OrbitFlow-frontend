type cb<T> = (data: T) => string;
export const selectConverter = <T extends object>(data: Array<T>, idCb: cb<T>, labelCb: cb<T> ) => {
    return data.map((e)=>{
        return {
            id: idCb(e),
            label: labelCb(e)
        }
    })
}
export const isEmptyObject = (data: object | null) => {
    if (!data) return true
    else return Object.entries(data)?.length ? false : true
}

export const readableDateConverter = (date:string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
}