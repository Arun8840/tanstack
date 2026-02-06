

export const getDate = (value: Date) => {
    const formattedDate = value
        ? new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : '';
    return formattedDate
}