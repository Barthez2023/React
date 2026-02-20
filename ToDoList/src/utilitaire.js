const formatDate = (dateString) => {
    const dateObject = new Date(dateString)

    const year = dateObject.getFullYear()
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
    const day = dateObject.getDate().toString().padStart(2, "0")
    const hours = dateObject.getHours().toString().padStart(2, "0")
    const minutes = dateObject.getMinutes().toString().padStart(2, "0")
    const seconde = dateObject.getSeconds().toString().padStart(2, "0")
    
    return `${year}-${month}-${day} at ${hours}:${minutes}:${seconde}`
}
export default formatDate