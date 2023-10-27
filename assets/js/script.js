const openButton = document.getElementById('openButton')
const closeButton = document.getElementById('closeButton')
const mobileNavbar = document.getElementById('mobileNavbar')


openButton.onclick=()=>{
    mobileNavbar.classList.add('opened')

    // mobileNavbar.style.transform="translateX(0%)"
}
closeButton.onclick=()=>{
    mobileNavbar.classList.remove('opened')
    // mobileNavbar.style.transform="translateX(100%)"

}