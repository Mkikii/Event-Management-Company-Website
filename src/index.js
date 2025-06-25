document.addEventListener("DOMContentLoaded", () => {
    const forms = document.getElementsByTagName("form")
    for(let form of forms)
        form.addEventListener("submit", (submittion) => {
            submittion.preventDefault()
        })
    function data(){
        const formData = new FormData(form)
        
    }  
})