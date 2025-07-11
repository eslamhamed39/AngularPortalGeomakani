
const btnLogout = document.getElementById('btn_logout');
const btnLogin = document.getElementById('btn_login');
const status = document.querySelector('.status');
const login_Success = document.querySelector('.login_Success');
const redMessage = document.querySelector('.redMessage');
const login_SuccessHome = document.querySelector('.login_SuccessHome');
const success_panel = document.querySelector('.success_panel');
const logoutPage = document.getElementById('logoutPage');
const Home_section = document.getElementById('Home_section');
const loginPage = document.getElementById('loginPage');
const map_section = document.getElementById('map_section');
const home_status = document.getElementById('home_status');
const image_date_right = document.getElementById('image_date_right');
const Home_btn = document.getElementById('Home');
const image_date_left = document.getElementById('image_date_left');
const optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    options = optionMenu.querySelectorAll(".option"),
    sBtn_text = optionMenu.querySelector(".sBtn-text");
const optionMenu1 = document.querySelector(".select-menu1"),
    selectBtn1 = optionMenu1.querySelector(".select-btn1"),
    options1 = optionMenu1.querySelectorAll(".option1"),
    sBtn_text1 = optionMenu1.querySelector(".sBtn-text1");
const satelite_Image = document.querySelector(".wrapper");
const content_image = document.querySelector(".content-image");
const element1 = document.getElementById("img_left");
const element2 = document.getElementById("img_right");
const element3 = document.getElementById("news");
const element4 = document.getElementById("url_news");
const element6 = document.querySelector(".parchart");
const element7 = document.querySelector(".piechart");
const element8 = document.getElementById("dashbord_img1");
const element9 = document.getElementById("dashbord_img2");
const element10 = document.getElementById("dashbord_img3");
const dialog_detect = document.getElementById("dialog_detect");
const container_row2 = document.querySelector(".container_row2");
const timeline = document.querySelector(".timeline");
const container_dashbord = document.querySelector(".container_dashbord ");
const loading = document.querySelector(".loading ");
const home_content = document.querySelector(".home_content");
const side_bar = document.querySelector(".Side_bar");
const bg_light = document.querySelector(".bg-light");
const hoverable = document.querySelector('.Montoring_project');
const allhoverable = document.querySelectorAll('.main_list_li');
const target = document.getElementById('Montoring_project_Menu');
const hoverable1 = document.querySelector('.Land_Management');
const allhoverable1 = document.querySelectorAll('.main_list_li');
const target1 = document.getElementById('Land_Management_Menu');
const hoverable2 = document.querySelector('.Forestry');
const allhoverable2 = document.querySelectorAll('.main_list_li');
const target2 = document.getElementById('Forestry_Menu');
const hoverable3 = document.querySelector('.Agriculture');
const allhoverable3 = document.querySelectorAll('.main_list_li');
const target3 = document.getElementById('Agriculture_Menu');
const hoverable4 = document.querySelector('.Mineral_Resources');
const allhoverable4 = document.querySelectorAll('.main_list_li');
const target4 = document.getElementById('Mineral_Resources_Menu');
const hoverable5 = document.querySelector('.Water_Resources');
const allhoverable5 = document.querySelectorAll('.main_list_li');
const target5 = document.getElementById('Water_Resources_Menu');
const hoverable6 = document.querySelector('.National_Security_Defense');
const allhoverable6 = document.querySelectorAll('.main_list_li');
const target6 = document.getElementById('National_Security_Defense_Menu');
const hoverable7 = document.querySelector('.palm_tree');
const allhoverable7 = document.querySelectorAll('.main_list_li');
const target7 = document.getElementById('Palm_Tree_Menu');
const container_data_dialog = document.getElementById('container_data_dialog');
const video_element = document.getElementById('video_element');
const video_container = document.getElementById('video_container');
const video_image = document.getElementById('video_image');
const vid = document.getElementById("video_element");
const controls = document.getElementById("custom-video__control");


// todo:------------------------- i end here ----------------------------//

// console.log(width_image + "px");
// content_image.style.width = width_image + "px";
// content_image.style.height = "100%";
// console.log(content_image);



// -------------------------- sidebar detection list --------------------//


// ------------------------------Get Value Function--------------------------------
function getValue() {
    var x = document.getElementById('UserName').value;
    // console.log(x);
    var y = document.getElementById('password').value;
    // console.log(y);
    check(x.toLowerCase(), y.toLowerCase());
}

//------------------------------User account --------------------------------------//

var name_id = '';
var isFound = "";
// ------------------------------Check account Function--------------------------------//
function check(user, pass) {
    const account = {
        username: "geo",
        password: "123",
    }
    // for (var i = 0; i < account.length; i++) {
    if ((user == account.username) && (pass == account.password)) {
        // name_id = { name: account[i].namePerson, id: account[i].idPreson, cname: account[i].username };
        isFound = true;
        console.log("Check Done");
    }
    // }
    if (isFound == "") {
        isFound = false;
    }
    return action()
}

// ------- sub Function to take Action -------//
function action() {
    if (isFound == true) {
        console.log(isFound);
        switchPage();
    }
    else {
        status.innerHTML = 'Wrong username or password';
        time();
    }
}
//----------------------------------Message Function ----------------------------------//

function messageSuccess(status) {
    // login_SuccessHome.innerHTML = status +' Success';
    btnLogin.classList.replace("d-inline-block", "d-none");
    btnLogout.classList.replace("d-inline-block", "d-none");
    home_status.innerHTML = status + ' Success!'
    success_panel.classList.replace("d-none", "d-inline-block");
    time();  //edite

}

// --------------------------Automatic Hide & Clear Function---------------------//
function clear() {
    document.getElementById('password').value = "";
}
function time() {
    setTimeout(() => {
        clear();
        isFound = ''
    }, 1000);
    setTimeout(() => {
        const box = document.querySelector('.status');
        box.innerHTML = '';
        // success_panel.classList.replace("d-inline-block", "d-none");
    }, 4000);
}

//-------------------- function to Switch login & logout page ----------------------//
function switchPage() {
    loginPage.classList.replace("d-block", "loading_hidden");
    // window.location.pathname = "/portal_v1/Home.html";
    window.location.pathname = "Home.html";
    // window.location.pathname = "http://85.31.237.210:8080/portal_v1/Home.html";
}

// setTimeout(() => {
//     loading.classList.replace("d-block", "d-none");
//     // home_content.classList.replace("d-none", "d-iznlineblock");

// }, 2800);
// setTimeout(() => {
//     // home_content.classList.replace("d-none", "d-iznlineblock");
//     Home_section.style.opacity = "1";
//     // side_bar.classList.replace("d-none", "d-flex");
// }, 3000);



// !---------------------- Fetch the GeoJSON data ----------------------//

let layer;
let layer_outline;

async function Refetch(layerID) {
    await fetch(`./Layer/${layerID}.json`)
        .then(response => response.json())
        .then(data => {
            layer = data;
        })

    await fetch(`./Layer/${layerID}_outline.json`)
        .then(response => response.json())
        .then(data => {
            layer_outline = data;
        })
    // if (status == "Show") {
    //     Crop_Health['paint']['fill-opacity'] = 0.4;
    //     Crop_Health_outline['paint']['line-width'] = 3;
    // }
    // else if (status == "Hide") {
    //     Crop_Health['paint']['fill-opacity'] = 0;
    //     Crop_Health_outline['paint']['line-width'] = 'none';
    // }
    // response();
}


function loadTomTomAPI() {
    return new Promise((resolve, reject) => {
        // Load the TomTom API asynchronously
        const script = document.createElement('script');
        script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.69.0/maps/maps-web.min.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function initializeMap() {
    try {
        // Wait for the TomTom API to finish loading
        await loadTomTomAPI();
        mapContent()

    } catch (error) {
        console.error('Error loading TomTom API:', error);
    }
}

// Call initializeMap when your page is ready
initializeMap();

function mapContent() {
    let viewport_width2 = document.documentElement.getBoundingClientRect().height;
    var api_key = 'YZlbkr2ee2sbGy3dZsWG85VE4mPsibyQ';
    var latAndLong = { lat: 4.012114320491342, lng: 21.667170602629522 };
    if (viewport_width2 < 620) {
        var zoomLevel = 1.6;
    } else {
        var zoomLevel = 2.2;
    }
    var map = tt.map({
        container: 'map',
        key: api_key,
        center: latAndLong,
        zoom: zoomLevel,
        // ================= style without label name =================//
        style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAVVRVTzI1SHRBR3MxQXRBaDtiYWI4ZjY0Yi1lZDkwLTRjYTEtYTlkYy1mYjcxODIyNzdlMzA=/drafts/0.json`,
    });
    const layerID_use = ["Project", "Project_outline", "Forest_Logging_Detection", "Forest_Logging_Detection_outline", "Land_Cover", "Land_Cover_outline", "Squatters_Camps", "Squatters_Camps_outline", "Land_Use", "Land_Use_outline", "Azuri_Towers_Nigeria", "Azuri_Towers_Nigeria_outline", "TATU_CITY_KENYA", "TATU_CITY_KENYA_outline", "Crop_Classification", "Crop_Classification_outline", "Mining_Monitoring", "Mining_Monitoring_outline", "Oil_Spill_Detection", "Oil_Spill_Detection_outline", "Wildfires", "Wildfires_outline", "Crop_Disease_Detection", "Crop_Disease_Detection_outline", "Crop_Health", "Crop_Health_outline", "Infrastructure_project", "Infrastructure_project_outline", "Libya_Flooding", "Libya_Flooding_outline", "khartoum_airport", "khartoum_airport_outline", "Renaissance_Dam", "Renaissance_Dam_outline", "Sudan_Border", "Sudan_Border_outline", "Dumyat", "Dumyat_outline", "Cahnge_Detection_Cairo", "Cahnge_Detection_Cairo_outline", "Ain_Sokhna_Port", "Ain_Sokhna_Port_outline", "Detect_rice_straw_burning", "Detect_rice_straw_burning_outline", "1", "1_outline", "2", "2_outline", "3", "3_outline", "4", "4_outline", "5", "5_outline", "6", "6_outline", "7", "7_outline", "8", "8_outline"]

    function removeAllSourceLayers(map) {
        var mapLayers = map.getStyle().layers;
        mapLayers.forEach(function (layer) {
            var layerId = layer.id;
            if (layer.source && layerID_use.includes(layerId)) {
                var sourceId = layer.source;
                map.removeLayer(layerId);
                map.removeSource(sourceId);
            }
        });
    }

    //....................................... polygon creation --------------------------------
    function removeListleft() {
        // Get the <ul> element
        var ul = document.getElementById("image_date_left");
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    function removeListright() {
        // Get the <ul> element
        var ul = document.getElementById("image_date_right");
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    // ~------------------------------------- Pursuing Project layer --------------------------------//
    const forest_Logging = document.getElementById("Forest_Logging_Detection");
    const Tanzania_Mega_Mall = document.getElementById("Project");
    const land_cover = document.getElementById("land_cover");
    const land_Use = document.getElementById("Land_Use");
    const squatters_camps = document.getElementById("Squatters_Camps");
    const azuri_Towers_Nigeria = document.getElementById("Azuri_Towers_Nigeria");
    const tATU_CITY_KENYA = document.getElementById("TATU_CITY_KENYA");
    const crop_Classification = document.getElementById("Crop_Classification");
    const mining_Monitoring = document.getElementById("Mining_Monitoring");
    const oil_Spill_Detection = document.getElementById("Oil_Spill_Detection");
    const wildfires = document.getElementById("Wildfires");
    const crop_Disease_Detection = document.getElementById("Crop_Disease_Detection");
    const crop_Health = document.getElementById("Crop_Health");
    const Infrastructure_project = document.getElementById("Infrastructure_project");
    const Libya_Flooding = document.getElementById("Libya_Flooding");
    const khartoum_airport = document.getElementById("khartoum_airport");
    const Renaissance_Dam = document.getElementById("Renaissance_Dam");
    const Sudan_Border = document.getElementById("Sudan_Border");
    const Dumyat = document.getElementById("Dumyat");
    const Cahnge_Detection_Cairo = document.getElementById("Cahnge_Detection_Cairo");
    const Ain_Sokhna_Port = document.getElementById("Ain_Sokhna_Port");
    const Detect_rice_straw_burning = document.getElementById("Detect_rice_straw_burning");
    const fayhan = document.getElementById("1");
    const abdelaziz = document.getElementById("2");
    const palm_id3 = document.getElementById("3");
    const palm_id4 = document.getElementById("4");
    const palm_id5 = document.getElementById("5");
    const palm_id6 = document.getElementById("6");
    const palm_id7 = document.getElementById("7");
    const palm_id8 = document.getElementById("8");
    const palm_id9 = document.getElementById("9");
    const palm_id10 = document.getElementById("10");




    // ^-------------------------- Monitoring Projects -------------------------//
    Tanzania_Mega_Mall.addEventListener("click", async function () {
        await Refetch("Buildings_Detection")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        element1.setAttribute("src", "Geo File/Polygon Create/2-2022.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/6-2023.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Screenshot.png");
        element8.setAttribute("src", "Dashbord/3.png");
        element9.setAttribute("src", "Dashbord/4.png");
        element10.setAttribute("src", "Dashbord/6.png");
        element6.style.display = 'block';
        element3.style.display = "block";
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "58%";
        timeline.style.height = "50%"
        container_row2.style.height = "50%"
        container_row2.style.height = "50%"
        container_dashbord.style.removeProperty("width")
        sBtn_text.innerText = "6-2023";
        sBtn_text1.innerText = "2-2022";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.thecitizen.co.tz/tanzania/news/national/mwanza-gets-ready-for-mega-mall-2533096");
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
    });


    // ^-------------------------- Forest_Logging_Detection -------------------------//
    forest_Logging.addEventListener("click", async function () {
        await Refetch("Forest_Logging_Detection")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        element1.setAttribute("src", "Geo File/Polygon Create/6-1-2023.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/10-3-2024.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Forest_Logging_News.png");
        element8.setAttribute("src", "Data/Forest_Logging_Detection/Dashboed/11.png");
        element9.setAttribute("src", "Data/Forest_Logging_Detection/Dashboed/13.png");
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        element3.style.display = "block";
        element4.setAttribute("href", "https://www.lifegate.com/congo-basin-rainforest-logging")
        sBtn_text.innerText = "10-3-2024";
        sBtn_text1.innerText = "6-1-2023";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
    });

    // ^--------------------------------- Land cover ----------------------------//
    land_cover.addEventListener("click", async function () {
        await Refetch("Land_Cover")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/land-C-S-image-2020.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/land-C-S-image-2023.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Screenshot.png");
        element8.setAttribute("src", "Geo File/Polygon Create/land.C.barchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/land.C.Chart.2015.jpg");
        element10.setAttribute("src", "Geo File/Polygon Create/land.C.Chart.2020.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        element7.style.width = "100%";
        sBtn_text.innerText = "2023";
        sBtn_text1.innerText = "2020";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.thecitizen.co.tz/tanzania/news/national/mwanza-gets-ready-for-mega-mall-2533096");
        container_dashbord.style.removeProperty("width");
    });

    // ^-------------------------- Squatters Camps ----------------------------//
    squatters_camps.addEventListener("click", async function () {
        await Refetch("Squatters_Camps")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        video_container.style.display = 'none';
        container_data_dialog.style.display = 'flex';
        element1.setAttribute("src", "Geo File/Polygon Create/Squatters_Camps-1-2020.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Squatters_Camps-12-2022.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Squatters_Camps_new.jpg");
        element8.setAttribute("src", "");
        element9.setAttribute("src", "");
        element10.setAttribute("src", "");
        element6.style.display = 'none';
        element3.style.display = "block";
        element8.style.display = "none";
        element9.style.display = "none";
        element10.style.display = "none";
        element3.style.height = "140px";
        element7.style.width = "100%";
        sBtn_text.innerText = "12-2022";
        sBtn_text1.innerText = "1-2020";
        container_dashbord.style.width = "100%";
        container_dashbord.style.height = "100%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.sciencephoto.com/media/182797/view/squatter-camp");
    });


    // ^-------------------------- Crop Classification Dumyat(Egypt) ----------------------------//
    Dumyat.addEventListener("click", async function () {
        await Refetch("Dumyat")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'none';
        video_container.style.display = 'inline-block';
        video_image.setAttribute("src", "videos/Crop_classification_Dumyat.mp4");
        vid.load();
    });

    // ^-------------------------- Cahnge Detection Cairo (Egypt)----------------------------//
    Cahnge_Detection_Cairo.addEventListener("click", async function () {
        await Refetch("Cahnge_Detection_Cairo")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'none';
        video_container.style.display = 'inline-block';
        video_image.setAttribute("src", "videos/Build_detiction_Cairo.mp4");
        vid.load();
    });
    // ^-------------------------- Ain Sokhna Port (Egypt)----------------------------//
    Ain_Sokhna_Port.addEventListener("click", async function () {
        await Refetch("Ain_Sokhna_Port")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'none';
        video_container.style.display = 'inline-block';
        video_image.setAttribute("src", "videos/Monitoring_Project_Ain_Sokhna_Port.mp4");
        vid.load();
    });

    // ^-------------------------- Detect rice straw burning (Egypt)----------------------------//
    Detect_rice_straw_burning.addEventListener("click", async function () {
        await Refetch("Detect_rice_straw_burning")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'none';
        video_container.style.display = 'inline-block';
        video_image.setAttribute("src", "videos/Detect_rice_straw_burning.mp4");
        vid.load();
    });



    // ^-------------------------- khartoum airport ----------------------------//
    khartoum_airport.addEventListener("click", async function () {
        await Refetch("khartoum_airport")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/khartoum_airport_20-2-2023.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/khartoum_airport_4-5-2024.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/khartoum_airport_news.png");
        element8.setAttribute("src", "");
        element9.setAttribute("src", "");
        element10.setAttribute("src", "");
        element6.style.display = 'none';
        element3.style.display = "block";
        element8.style.display = "none";
        element9.style.display = "none";
        element10.style.display = "none";
        element3.style.height = "140px";
        element7.style.width = "100%";
        sBtn_text.innerText = "4-5-2024";
        sBtn_text1.innerText = "20-2-2023";
        container_dashbord.style.width = "100%";
        container_dashbord.style.height = "100%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.aa.com.tr/en/africa/fire-breaks-out-at-khartoum-airport-amid-sudan-clashes/2876543");
    });


    // ^-------------------------- Renaissance Dam ----------------------------//
    Renaissance_Dam.addEventListener("click", async function () {
        await Refetch("Renaissance_Dam")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Renaissance_Dam_11-2013.JPG");
        element2.setAttribute("src", "Geo File/Polygon Create/Renaissance_Dam_10-2023.JPG");
        element3.setAttribute("src", "Geo File/Polygon Create/Renaissance_Dam_news.png");
        element8.setAttribute("src", "");
        element9.setAttribute("src", "");
        element10.setAttribute("src", "");
        element6.style.display = 'none';
        element3.style.display = "block";
        element8.style.display = "none";
        element9.style.display = "none";
        element10.style.display = "none";
        element3.style.height = "140px";
        element7.style.width = "100%";
        sBtn_text.innerText = "10-2023";
        sBtn_text1.innerText = "11-2013";
        container_dashbord.style.width = "100%";
        container_dashbord.style.height = "100%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.water-technology.net/projects/grand-ethiopian-renaissance-dam-africa/");
    });


    // ^-------------------------- Crisis in Sudan Border ----------------------------//
    Sudan_Border.addEventListener("click", async function () {
        await Refetch("Sudan_Border")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Sudan_Border_11-2022.JPG");
        element2.setAttribute("src", "Geo File/Polygon Create/Sudan_Border_5-2023.JPG");
        element3.setAttribute("src", "Geo File/Polygon Create/Sudan_Border_news.png");
        element8.setAttribute("src", "");
        element9.setAttribute("src", "");
        element10.setAttribute("src", "");
        element6.style.display = 'none';
        element3.style.display = "block";
        element8.style.display = "none";
        element9.style.display = "none";
        element10.style.display = "none";
        element3.style.height = "140px";
        element7.style.width = "100%";
        sBtn_text.innerText = "5-2023";
        sBtn_text1.innerText = "11-2022";
        container_dashbord.style.width = "100%";
        container_dashbord.style.height = "100%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://english.ahram.org.eg/News/498920.aspx");
    });

    // ^-------------------------- Infrastructure_project ----------------------------//
    Infrastructure_project.addEventListener("click", async function () {
        await Refetch("Infrastructure_project")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Infrastructure_project_11-2020.jpeg");
        element2.setAttribute("src", "Geo File/Polygon Create/Infrastructure_project_12-2023.jpeg");
        element3.setAttribute("src", "Geo File/Polygon Create/Infrastructure_project_news.png");
        element8.setAttribute("src", "Geo File/Polygon Create/Infrastructure_project_parchart.jpeg");
        element9.setAttribute("src", "Geo File/Polygon Create/Infrastructure_project_liner.jpeg");
        element3.style.display = "block";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        sBtn_text.innerText = "12-2023";
        sBtn_text1.innerText = "11-2020";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://feedbackoysg.com/nearly-completed-iseyin-fapote-ogbomoso-road/");
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- Land Use -----------------------------//
    land_Use.addEventListener("click", async function () {
        await Refetch("Land_Use")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Libya_satelliteImage1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Land-use-image1.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Screenshot.png");
        element8.setAttribute("src", "Geo File/Polygon Create/Land-use-barchart1.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Land-use-barchart2.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "Land Use";
        container_row2.style.height = "50%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });


    // ^---------------------------------- Palm_tree_1 -----------------------------//
    fayhan.addEventListener("click", async function () {
        await Refetch("1")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/fayhan1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/fayhan2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/fayhan3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_2 -----------------------------//
    abdelaziz.addEventListener("click", async function () {
        await Refetch("2")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/abdelaziz1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/abdelaziz2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/abdelaziz3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_3 -----------------------------//
    palm_id3.addEventListener("click", async function () {
        await Refetch("3")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id1_1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id1_2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id1_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });


    // ^---------------------------------- Palm_tree_4 -----------------------------//
    palm_id4.addEventListener("click", async function () {
        await Refetch("4")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id2_1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id2_2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id2_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_5 -----------------------------//
    palm_id5.addEventListener("click", async function () {
        await Refetch("5")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id3_1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id3_2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id3_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_6 -----------------------------//
    palm_id6.addEventListener("click", async function () {
        await Refetch("6")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id4_1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id4_2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id4_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_7 -----------------------------//
    palm_id7.addEventListener("click", async function () {
        await Refetch("7")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id5_1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id5_2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id5_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_8 -----------------------------//
    palm_id8.addEventListener("click", async function () {
        await Refetch("8")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id6_1.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id6_2.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id6_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_9 -----------------------------//
    palm_id9.addEventListener("click", async function () {
        await Refetch("9")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id9_10-2023.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id9_After Detection.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id9_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });
    // ^---------------------------------- Palm_tree_10 -----------------------------//
    palm_id10.addEventListener("click", async function () {
        await Refetch("10")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Palm_id10_3-2023.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Palm_id10_After Detection.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Palm_id10_3.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "none";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "After Detection";
        container_row2.style.height = "0%";
        timeline.style.height = "100%";
        sBtn_text1.innerText = "satellite Image";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- Azuri Towers Nigeria -----------------------------//
    azuri_Towers_Nigeria.addEventListener("click", async function () {
        await Refetch("Azuri_Towers_Nigeria")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Azuri_Towers_Nigeria-5-2016.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Azuri_Towers_Nigeria-2-2024.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Azuri_Towers_Nigeria-new.png");
        element8.setAttribute("src", "Geo File/Polygon Create/Azuri_Towers_Nigeria-barchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Azuri_Towers_Nigeria-pointchart.jpg");
        element3.style.display = "block";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        sBtn_text.innerText = "2-2024";
        sBtn_text1.innerText = "5-2016";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.itbng.com/azuri-peninsula-eko-atlantic-city-lagos");
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- TATU CITY KENYA -----------------------------//
    tATU_CITY_KENYA.addEventListener("click", async function () {
        await Refetch("TATU_CITY_KENYA")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/TATU_CITY_KENYA-12-2017.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/TATU_CITY_KENYA-2-2024.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/TATU_CITY_KENYA-News.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/TATU_CITY_KENYA-Barchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/TATU_CITY_KENYA-pointchart.jpg");
        element3.style.display = "block";
        element3.style.height = "135px";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "2-2024";
        sBtn_text1.innerText = "12-2017";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://nellions.co.ke/blog/upcoming-residential-estates-nairobi/#9-Tatu-City");
        container_dashbord.style.removeProperty("width");
    });


    // ^---------------------------------- Libya Flooding -----------------------------//
    Libya_Flooding.addEventListener("click", async function () {
        await Refetch("Libya_Flooding")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Libya_Flooding_6-2023.JPG");
        element2.setAttribute("src", "Geo File/Polygon Create/Libya_Flooding_9-2023.JPG");
        element3.setAttribute("src", "Geo File/Polygon Create/Libya_Flooding_news.png");
        element8.setAttribute("src", "Geo File/Polygon Create/Libya_Flooding_barchart1.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Libya_Flooding_barchart2.jpg");
        element3.style.display = "block";
        element3.style.height = "135px";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "9-2023";
        sBtn_text1.innerText = "6-2023";
        container_row2.style.height = "49%";
        timeline.style.height = "50%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.britannica.com/event/Libya-flooding-of-2023");
        container_dashbord.style.removeProperty("width");
    });


    // ^---------------------------------- Crop Classification Kenya -----------------------------//
    crop_Classification.addEventListener("click", async function () {
        await Refetch("Crop_Classification")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Crop_Classification_satelliteImage.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Crop_Classification_Classification.png");
        element8.setAttribute("src", "Geo File/Polygon Create/Crop_Classification_parchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Crop_Classification_piechart.jpg");
        element3.style.display = "none";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "Classification";
        sBtn_text1.innerText = "Satellite Image";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- Mining Monitoring -----------------------------//
    mining_Monitoring.addEventListener("click", async function () {
        await Refetch("Mining_Monitoring")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Mining_Monitoring-7-2013.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Mining_Monitoring-6-2022.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Mining_Monitoring_news.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Mining_Monitoring-barchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Mining_Monitoring-circalchart.jpg");
        element3.style.display = "block";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        element3.style.height = "130px";
        sBtn_text.innerText = "06-2022";
        sBtn_text1.innerText = "07-2013";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_dashbord.style.removeProperty("width")
        element4.setAttribute("href", "https://www.digest.tz/ongoing-struggle-with-small-scale-mining-threating-environment/");
    });

    // ^---------------------------------- Oil Spill Detection -----------------------------//
    oil_Spill_Detection.addEventListener("click", async function () {
        await Refetch("Oil_Spill_Detection")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Oil_Spill_27-7-2021.JPG");
        element2.setAttribute("src", "Geo File/Polygon Create/Oil_Spill_26-8-2021.JPG");
        element3.setAttribute("src", "Geo File/Polygon Create/Oil_Spill_Detection-news.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Oil_Spill_Detection-parchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Oil_Spill_Detection-pointchart.jpg");
        element3.style.display = "block";
        element3.style.height = "130px";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        container_row2.style.height = "48.2%";
        timeline.style.height = "50%";
        element7.style.width = "100%";
        sBtn_text.innerText = "26-8-2021";
        sBtn_text1.innerText = "27-7-2021";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.egypttoday.com/Article/1/106225/Egyptian-El-Monakh-beach-in-Port-Said-cleaned-up-from");
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- Wildfires Detection -----------------------------//
    wildfires.addEventListener("click", async function () {
        await Refetch("Wildfires")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Wildfires-23-7-2023.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Wildfires-29-3-2024.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Wildfires-News.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Wildfires-barchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Wildfires-saidebarchart.jpg");
        element3.style.display = "block";
        element3.style.height = "130px";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        sBtn_text.innerText = "29-3-2024";
        sBtn_text1.innerText = "23-7-2023";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.thenationalnews.com/world/2023/07/26/horrors-of-wildfires-from-space-satellite-photos-track-blazes-in-europe-and-north-africa/");
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- Crop_Disease_Detection ---------------------------//
    crop_Disease_Detection.addEventListener("click", async function () {
        await Refetch("Crop_Disease_Detection")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Crop_Disease_Detection_Satellite-image.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Crop_Disease_Detection.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Crop_Disease_Detection-News.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Crop_Disease_Detection-Circelchart.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Crop_Disease_Detection-Linechart.jpg");
        element3.style.display = "block";
        element3.style.height = "135px";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "Crop Disease Detection";
        sBtn_text1.innerText = "Satellite Image";
        container_row2.style.height = "50%";
        timeline.style.height = "50%";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        element4.setAttribute("href", "https://www.downtoearth.org.in/news/agriculture/savage-mode-in-a-warmer-wetter-world-pests-are-multiplying-faster-and-damaging-crops-severely-91049");
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- Crop_Health -----------------------------//
    crop_Health.addEventListener("click", async function () {
        await Refetch("Crop_Health")
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
        await map.addLayer(layer);
        await map.addLayer(layer_outline);
        container_data_dialog.style.display = 'flex';
        video_container.style.display = 'none';
        element1.setAttribute("src", "Geo File/Polygon Create/Crop_Health-11-3-2023.jpg");
        element2.setAttribute("src", "Geo File/Polygon Create/Crop_Health-11-3-2023 NDVI.jpg");
        element3.setAttribute("src", "Geo File/Polygon Create/Crop_Health-News.jpg");
        element8.setAttribute("src", "Geo File/Polygon Create/Crop_Health-Digram1.jpg");
        element9.setAttribute("src", "Geo File/Polygon Create/Crop_Health-Digram2.jpg");
        element3.style.display = "block";
        element3.style.height = "135px";
        element6.style.display = 'none';
        element8.style.display = "block";
        element9.style.display = "block";
        element10.style.display = "block";
        element7.style.width = "100%";
        sBtn_text.innerText = "11-3-2023 NDVI";
        sBtn_text1.innerText = "11-3-2023";
        image_date_left.style.height = 'auto';
        image_date_right.style.height = 'auto';
        container_row2.style.height = "49%";
        timeline.style.height = "50%";
        // satelite_Image.style.width = "56%";
        element4.setAttribute("href", "https://www.usaid.gov/kenya/agriculture-food-and-water-security");
        container_dashbord.style.removeProperty("width");
    });

    // ^---------------------------------- Home -----------------------------//

    Home_btn.addEventListener("click", function () {
        try {
            removeAllSourceLayers(map)
        } catch (error) {
            // console.log("error")
        }
    });

    // -------------------------------- Hover section -----------------------//
    function addHoverEffect(layerId) {
        map.on('mouseenter', layerId, function () {
            map.setPaintProperty(layerId, 'fill-color', '#b8cdff'); // Change fill color on hover
            if ('#fff') {
                map.setPaintProperty(layerId + '_outline', 'line-color', '#182ead'); // Change outline color on hover
            }
        });
        // Add mouseleave event listener to revert the changes
        map.on('mouseleave', layerId, function () {
            // Revert fill color
            map.setPaintProperty(layerId, 'fill-color', '#216bc0'); // Original fill color
            if ('#182ead') {
                // Revert outline color
                map.setPaintProperty(layerId + '_outline', 'line-color', '#fff'); // Original outline color
            }
        });
    }
    addHoverEffect('Land_Cover');
    addHoverEffect('Land_Use');
    addHoverEffect('Project');
    addHoverEffect('Forest_Logging_Detection');
    addHoverEffect('Squatters_Camps');
    addHoverEffect('Azuri_Towers_Nigeria');
    addHoverEffect('TATU_CITY_KENYA');
    addHoverEffect('Crop_Classification');
    addHoverEffect('Mining_Monitoring');
    addHoverEffect('Oil_Spill_Detection');
    addHoverEffect('Wildfires');
    addHoverEffect('Crop_Disease_Detection');
    addHoverEffect('Crop_Health');
    addHoverEffect('Infrastructure_project');
    addHoverEffect('Libya_Flooding');
    addHoverEffect('khartoum_airport');
    addHoverEffect('Renaissance_Dam');
    addHoverEffect('Sudan_Border');
    addHoverEffect('Dumyat');
    addHoverEffect('Cahnge_Detection_Cairo');
    addHoverEffect('Ain_Sokhna_Port');
    addHoverEffect('Detect_rice_straw_burning');
    addHoverEffect('1');
    addHoverEffect('2');
    addHoverEffect('3');
    addHoverEffect('4');
    addHoverEffect('5');
    addHoverEffect('6');
    addHoverEffect('7');
    addHoverEffect('8');
    addHoverEffect('9');
    addHoverEffect('10');

    //--------------------------------- End polygon creation --------------------------------//
    function handleMapClick(id, newCoordinates, newZoomLevel, angle) {
        document.getElementById(id).addEventListener('click', function () {
            let viewport_width = document.documentElement.getBoundingClientRect().height;
            if (viewport_width < 620) {
                var duration = 6000;
                map.flyTo({
                    center: newCoordinates,
                    zoom: newZoomLevel - 1,
                    duration: duration,
                    pitch: angle,
                    // bearing: 0,
                });
            } else {
                var duration = 6000;
                map.flyTo({
                    center: newCoordinates,
                    zoom: newZoomLevel,
                    duration: duration,
                    pitch: angle,
                    // bearing: 0,
                });
            }
        });
    }
    handleMapClick('Home', [21.667170602629522, 4.012114320491342], 2.2, 0);
    handleMapClick('Forest_Logging_Detection', [25.13647, 0.47325], 13, 45);
    handleMapClick('land_cover', [-5.6402, 35.2132], 9, 45);
    handleMapClick('Project', [39.2022738, -6.6880111], 16, 45);
    handleMapClick('Land_Use', [16.415, 27.525], 4.8, 45);
    handleMapClick('Squatters_Camps', [31.0187547, -29.8457573], 18, 45);
    handleMapClick('Azuri_Towers_Nigeria', [3.4063485, 6.4027519], 16.9, 45);
    handleMapClick('TATU_CITY_KENYA', [36.8897801, -1.1556409], 16, 45);
    handleMapClick('Crop_Classification', [37.934, 0.927], 5.5, 45);
    handleMapClick('Mining_Monitoring', [39.379219, -7.161839], 15, 45);
    handleMapClick('Oil_Spill_Detection', [32.21209, 31.50670], 8.5, 45);
    handleMapClick('Wildfires', [4.82700, 36.69667], 9, 45);
    handleMapClick('Crop_Disease_Detection', [35.25887, -0.38983], 13, 45);
    handleMapClick('Crop_Health', [36.05687, -0.23038], 13, 45);
    handleMapClick('Infrastructure_project', [3.9154647, 8.1104762], 14, 45);
    handleMapClick('Libya_Flooding', [22.638857, 32.758258], 14, 45);
    handleMapClick('khartoum_airport', [32.552265, 15.591284], 13, 45);
    handleMapClick('Renaissance_Dam', [35.089010, 11.214324], 13.5, 45);
    handleMapClick('Sudan_Border', [31.152342, 21.999103], 13.5, 45);
    handleMapClick('Dumyat', [31.7461, 31.4020], 8.9, 45);
    handleMapClick('Cahnge_Detection_Cairo', [31.6104, 29.9992], 8.9, 45);
    handleMapClick('Ain_Sokhna_Port', [32.34167, 29.64314], 11, 45);
    handleMapClick('Detect_rice_straw_burning', [29.698, 27.127], 4.8, 45);
    handleMapClick('1', [43.5904433, 25.3306318], 18, 45);
    handleMapClick('2', [43.4305268, 25.7923515], 18, 45);
    handleMapClick('3', [43.9864454, 25.5295076], 18, 45);
    handleMapClick('4', [43.9764618, 25.5994940], 18, 45);
    handleMapClick('5', [43.9622505, 25.3749770], 18, 45);
    handleMapClick('6', [43.9360850, 25.3633250], 18, 45);
    handleMapClick('7', [43.88081962, 25.46766756], 18, 45);
    handleMapClick('8', [43.3960008, 26.1624580], 18, 45);
    handleMapClick('9', [44.14331397, 26.89133424], 18, 45);
    handleMapClick('10', [44.21888586, 26.68871151], 18, 45);

    // !------------- change pointer and after click  appear popup --------------------//


    // ~============================== Mouse pointer =============================//
    function setCursor(layerId) {
        map.on('mouseenter', layerId, function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, function () {
            map.getCanvas().style.cursor = '';
        });
    }
    setCursor('Project');
    setCursor('Forest_Logging_Detection');
    setCursor('Land_Cover');
    setCursor('Land_Use');
    setCursor('Squatters_Camps');
    setCursor('Azuri_Towers_Nigeria');
    setCursor('TATU_CITY_KENYA');
    setCursor('Crop_Classification');
    setCursor('Mining_Monitoring');
    setCursor('Oil_Spill_Detection');
    setCursor('Wildfires');
    setCursor('Crop_Disease_Detection');
    setCursor('Crop_Health');
    setCursor('Infrastructure_project');
    setCursor('Libya_Flooding');
    setCursor('khartoum_airport');
    setCursor('Renaissance_Dam');
    setCursor('Sudan_Border');
    setCursor('Dumyat');
    setCursor('Cahnge_Detection_Cairo');
    setCursor('Ain_Sokhna_Port');
    setCursor('Detect_rice_straw_burning');
    setCursor('1');
    setCursor('2');
    setCursor('3');
    setCursor('4');
    setCursor('5');
    setCursor('6');
    setCursor('7');
    setCursor('8');
    setCursor('9');
    setCursor('10');

    // &======================== click layer to appear popup Detection ========================//

    var layerNames = [
        'Forest_Logging_Detection',
        'Land_Cover',
        'Land_Use',
        'Crop_Classification',
        'Azuri_Towers_Nigeria',
        'TATU_CITY_KENYA',
        'Crop_Health',
        'Crop_Disease_Detection',
        'Oil_Spill_Detection',
        'Wildfires',
        'Mining_Monitoring',
        'Project',
        'Squatters_Camps',
        'Infrastructure_project',
        'Libya_Flooding',
        'khartoum_airport',
        'Renaissance_Dam',
        'Sudan_Border',
        'Dumyat',
        'Cahnge_Detection_Cairo',
        'Ain_Sokhna_Port',
        'Detect_rice_straw_burning',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
    ];

    // Loop through the array and bind the click event for each layer
    layerNames.forEach(function (layerName) {
        map.on('click', layerName, function (e) {
            toggleDiv2();
            // console.log(layerName)
        });
    });

    function toggleDiv2() {
        var div = document.querySelector('.dialog_detect');
        if (div.style.display === 'none' || div.style.display === '') {
            div.style.display = 'flex';
            setTimeout(function () {
                document.addEventListener('mousedown', clickOutsideDiv);
            }, 1);
        }
        else {
            div.style.display = 'none';
            document.removeEventListener('mousedown', clickOutsideDiv);
        }
        handleResize();
        removeListleft();
        removeListright();
    }
    function handleResize() {
        // Code to run when the window size changes
        let width_image = document.querySelector('.wrapper').getBoundingClientRect().width;
        // console.log(width_image)
        document.getElementById('img_right').style.width = width_image + "px";
        document.getElementById('img_left').style.width = width_image + "px";
        slider()
    }

    window.addEventListener('resize', handleResize);


    function clickOutsideDiv(event) {
        var div = document.querySelector('.dialog_detect');
        if (!div.contains(event.target)) {
            div.style.display = 'none';
            document.removeEventListener('click', clickOutsideDiv);
            try {
                vid.load();
                controls.innerHTML = "►";
            }
            catch (e) { }
        }
    }
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point);
        try {
            globalvar = features["0"].layer["id"];
        } catch (e) { }
        // getLayerId();
        linkedImageWithSelect(globalvar);
    });
    map.on('load', function () {
        setTimeout(function () { load_map(); }, 1000);
        // load_map()
    });
}
function load_map() {
    const map = document.getElementById('map');
    map.style.opacity = "1";
    Home_section.classList.add("Home_section")
    Home_section.style.opacity = "1";
    side_bar.style.opacity = "1";
    loading.classList.add("loading_hidden")
}
let globalvar;


// *==============================> Slider Comparison imege <================================//
function slider() {
    let active = false;
    document.querySelector('.scroller').addEventListener('mousedown', function () {
        active = true;
        document.querySelector('.scroller').classList.add('scrolling');
    });
    document.body.addEventListener('mouseup', function () {
        active = false;
        document.querySelector('.scroller').classList.remove('scrolling');
    });
    document.body.addEventListener('mouseleave', function () {
        active = false;
        document.querySelector('.scroller').classList.remove('scrolling');
    });
    document.body.addEventListener('mousemove', function (e) {
        if (!active) return;
        let x = e.pageX;
        x -= document.querySelector('.wrapper').getBoundingClientRect().left;
        scrollIt(x);
    });
    function scrollIt(x) {
        let minWidth = 0;
        let maxWidth = document.querySelector('.wrapper').getBoundingClientRect().width;
        let initialPosition = 250;
        let transform = initialPosition + (x - initialPosition);
        transform = Math.min(Math.max(transform, minWidth), maxWidth);
        document.querySelector('.after').style.width = transform + "px";
        document.querySelector('.scroller').style.left = transform + "px";
    };

    scrollIt(250);
    document.querySelector('.scroller').addEventListener('touchstart', function () {
        active = true;
        document.querySelector('.scroller').classList.add('scrolling');
    });

    document.body.addEventListener('touchend', function () {
        active = false;
        document.querySelector('.scroller').classList.remove('scrolling');
    });

    document.body.addEventListener('touchcancel', function () {
        active = false;
        document.querySelector('.scroller').classList.remove('scrolling');
    });

    document.body.addEventListener('touchmove', function (e) {
        if (!active) return;
        let x = e.touches[0].pageX;
        x -= document.querySelector('.wrapper').getBoundingClientRect().left;
        scrollIt(x);
    });
};
// ---------------------------- To Make sidebar Active when click  ----------------------------//

function setActive(elementId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(elementId).classList.add('active');
}


document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', event => {
        setActive(event.currentTarget.id);
    });
});
document.body.addEventListener('click', event => {
    const clickedElement = event.target;
    if (!clickedElement.closest('.nav-item') & !document.getElementById("detect").classList.contains("active")) {
        setActive('Home');
    }
});
// *------------------------- Select options------------------------//
//  left Selector
// function to create li from list 
function linkedImageWithSelect(idlayer) {
    const fileNamesMap = {
        'Project': ["6-2023", "2-2022"],
        'Forest_Logging_Detection': ["10-3-2024", "16-12-2023", "6-1-2023"],
        'Land_Cover': ["2023", "2020"],
        'Squatters_Camps': ["12-2022", "1-2020"],
        'Azuri_Towers_Nigeria': ["2-2024", "1-2020", "12-2018", "2-2018", "5-2016"],
        'TATU_CITY_KENYA': ["2-2024", "1-2023", "2-2021", "1-2020", "1-2019", "12-2017"],
        'Mining_Monitoring': ["6-2022", "6-2020", "10-2017", "6-2014", "7-2013"],
        'Oil_Spill_Detection': ["26-8-2021", "21-8-2021", "16-8-2021", "11-8-2021", "6-8-2021", "1-8-2021", "27-7-2021"],
        'Wildfires': ["29-3-2024", "30-11-2023", "11-10-2023", "23-7-2023"],
        'Crop_Health': ["21-5-2022", "21-5-2022 NDVI", "11-3-2023", "11-3-2023 NDVI"],
        'Infrastructure_project': ["12-2023", "11-2020"],
        'Libya_Flooding': ["9-2023", "6-2023"],
        'khartoum_airport': ["4-5-2024", "23-4-2023", "17-4-2023", "20-2-2023"],
        'Renaissance_Dam': ["10-2023", "3-2022", "11-2020", "10-2020", "1-2016", "11-2013"],
        'Sudan_Border': ["5-2023", "11-2022"],
        // '9': ["After Detection","10-2023", "5-2024"],
        // '10': ["After Detection","3-2023", "5-2024"],

    };
    const fileNames = fileNamesMap[idlayer] || [];
    displayFileNames(fileNames);
    function displayFileNames(date) {
        const leftSelector = document.getElementById('image_date_left');
        const rightSelector = document.getElementById('image_date_right');
        date.forEach(date => {
            var listItem = document.createElement('li');
            let span = document.createElement('span');
            listItem.classList.add("option")
            span.classList.add("option-text")
            leftSelector.appendChild(listItem);
            listItem.appendChild(span);
            span.textContent = date;
        });
        date.forEach(date => {
            var listItem1 = document.createElement('li');
            let span1 = document.createElement('span1');
            listItem1.classList.add("option1")
            span1.classList.add("option-text1")
            rightSelector.appendChild(listItem1);
            listItem1.appendChild(span1);
            span1.textContent = date;
        });
        const options = optionMenu.querySelectorAll(".option")
        options.forEach(option => {
            option.addEventListener("click", () => {
                handleOptionClick(option);
            });
        });
        const options1 = optionMenu1.querySelectorAll(".option1")
        options1.forEach(option => {
            option.addEventListener("click", () => {
                handleOptionClick1(option);
            });
        });
    }
}

// Function to handle click event of select button
function handleSelectButtonClick() {
    optionMenu.classList.toggle("active");
    document.addEventListener("click", hide_Data_selctor_list)
    hide_Data_selctor_list()
}
function handleSelectButtonClick1() {
    optionMenu1.classList.toggle("active");
    document.addEventListener("click", hide_Data_selctor_list1)
}
function hide_Data_selctor_list(event) {
    try {
        if (!optionMenu.contains(event.target)) {
            optionMenu.classList.remove("active");
        }
    } catch (e) { }
}
function hide_Data_selctor_list1(event) {
    try {
        if (!optionMenu1.contains(event.target)) {
            optionMenu1.classList.remove("active");
        }
    } catch (e) { }
}


function handleOptionClick(option) {
    const selectedOption = option.querySelector(".option-text").innerText;
    sBtn_text.innerText = selectedOption;
    optionMenu.classList.remove("active");
    const element1 = document.getElementById("img_right");
    const imagePaths = {
        "Land_Cover": `Geo File/Polygon Create/land-C-S-image-${selectedOption}.jpg`,
        "Project": `Geo File/Polygon Create/${selectedOption}.jpg`,
        "Forest_Logging_Detection": `Geo File/Polygon Create/${selectedOption}.jpg`,
        "Squatters_Camps": `Geo File/Polygon Create/Squatters_Camps-${selectedOption}.jpg`,
        "Azuri_Towers_Nigeria": `Geo File/Polygon Create/Azuri_Towers_Nigeria-${selectedOption}.jpg`,
        "TATU_CITY_KENYA": `Geo File/Polygon Create/TATU_CITY_KENYA-${selectedOption}.jpg`,
        "Mining_Monitoring": `Geo File/Polygon Create/Mining_Monitoring-${selectedOption}.jpg`,
        "Oil_Spill_Detection": `Geo File/Polygon Create/Oil_Spill_${selectedOption}.JPG`,
        "Wildfires": `Geo File/Polygon Create/Wildfires-${selectedOption}.jpg`,
        "Crop_Health": `Geo File/Polygon Create/Crop_Health-${selectedOption}.jpg`,
        "Infrastructure_project": `Geo File/Polygon Create/Infrastructure_project_${selectedOption}.jpeg`,
        "Libya_Flooding": `Geo File/Polygon Create/Libya_Flooding_${selectedOption}.JPG`,
        "khartoum_airport": `Geo File/Polygon Create/khartoum_airport_${selectedOption}.jpg`,
        "Renaissance_Dam": `Geo File/Polygon Create/Renaissance_Dam_${selectedOption}.JPG`,
        "Sudan_Border": `Geo File/Polygon Create/Sudan_Border_${selectedOption}.JPG`,
        // "9": `Geo File/Polygon Create/Palm_id9_${selectedOption}.jpg`,
        // "10": `Geo File/Polygon Create/Palm_id10_${selectedOption}.jpg`,
    };
    const imagePath = imagePaths[globalvar];
    if (imagePath) {
        element1.setAttribute("src", imagePath);
    }
}

function handleOptionClick1(option) {
    const selectedOption1 = option.querySelector(".option-text1").innerText;
    sBtn_text1.innerText = selectedOption1;
    optionMenu1.classList.remove("active");
    const element2 = document.getElementById("img_left");
    const imagePaths = {
        "Land_Cover": `Geo File/Polygon Create/land-C-S-image-${selectedOption1}.jpg`,
        "Project": `Geo File/Polygon Create/${selectedOption1}.jpg`,
        "Forest_Logging_Detection": `Geo File/Polygon Create/${selectedOption1}.jpg`,
        "Squatters_Camps": `Geo File/Polygon Create/Squatters_Camps-${selectedOption1}.jpg`,
        "Azuri_Towers_Nigeria": `Geo File/Polygon Create/Azuri_Towers_Nigeria-${selectedOption1}.jpg`,
        "TATU_CITY_KENYA": `Geo File/Polygon Create/TATU_CITY_KENYA-${selectedOption1}.jpg`,
        "Mining_Monitoring": `Geo File/Polygon Create/Mining_Monitoring-${selectedOption1}.jpg`,
        "Oil_Spill_Detection": `Geo File/Polygon Create/Oil_Spill_${selectedOption1}.JPG`,
        "Wildfires": `Geo File/Polygon Create/Wildfires-${selectedOption1}.jpg`,
        "Crop_Health": `Geo File/Polygon Create/Crop_Health-${selectedOption1}.jpg`,
        "Infrastructure_project": `Geo File/Polygon Create/Infrastructure_project_${selectedOption1}.jpeg`,
        "Libya_Flooding": `Geo File/Polygon Create/Libya_Flooding_${selectedOption1}.JPG`,
        "khartoum_airport": `Geo File/Polygon Create/khartoum_airport_${selectedOption1}.jpg`,
        "Renaissance_Dam": `Geo File/Polygon Create/Renaissance_Dam_${selectedOption1}.JPG`,
        "Sudan_Border": `Geo File/Polygon Create/Sudan_Border_${selectedOption1}.JPG`,
        // "9": `Geo File/Polygon Create/Palm_id9_${selectedOption1}.jpg`,
        // "10": `Geo File/Polygon Create/Palm_id10_${selectedOption1}.jpg`,

    };
    const imagePath = imagePaths[globalvar];
    if (imagePath) {
        element2.setAttribute("src", imagePath);
    }
}
setTimeout(() => {
    selectBtn.addEventListener("click", handleSelectButtonClick);
    selectBtn1.addEventListener("click", handleSelectButtonClick1);
}, 3000);

// !====================== To show All List and all effect (hover) ==================== //



hoverable.addEventListener('mouseover', function () {
    target.style.display = 'block';
    hoverable.style.background = ' #0000003d';
    hoverable.querySelector('a').style.color = '#ffffff';
});
target.addEventListener('mouseleave', function () {
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
});
target.addEventListener('click', function () {
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable.length; i++) {
    allhoverable[i].addEventListener("mouseover", function () {
        target.style.display = 'none';
        hoverable.style.background = ' none';
        hoverable.querySelector('a').style.color = '#0011ff';
    });
}


hoverable1.addEventListener('mouseover', function () {
    target1.style.display = 'block';
    hoverable1.style.background = ' #0000003d';
    hoverable1.querySelector('a').style.color = '#ffffff';
});
target1.addEventListener('mouseleave', function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
});
target1.addEventListener('click', function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable1.length; i++) {
    allhoverable1[i].addEventListener("mouseover", function () {
        target1.style.display = 'none';
        hoverable1.style.background = ' none';
        hoverable1.querySelector('a').style.color = '#0011ff';
    });
}

hoverable2.addEventListener('mouseover', function () {
    target2.style.display = 'block';
    hoverable2.style.background = ' #0000003d';
    hoverable2.querySelector('a').style.color = '#ffffff';
});
target2.addEventListener('mouseleave', function () {
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
});
target2.addEventListener('click', function () {
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable2.length; i++) {
    allhoverable2[i].addEventListener("mouseover", function () {
        target2.style.display = 'none';
        hoverable2.style.background = ' none';
        hoverable2.querySelector('a').style.color = '#0011ff';
    });
}

hoverable3.addEventListener('mouseover', function () {
    target3.style.display = 'block';
    hoverable3.style.background = ' #0000003d';
    hoverable3.querySelector('a').style.color = '#ffffff';
});
target3.addEventListener('mouseleave', function () {
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
});
target3.addEventListener('click', function () {
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable3.length; i++) {
    allhoverable3[i].addEventListener("mouseover", function () {
        target3.style.display = 'none';
        hoverable3.style.background = ' none';
        hoverable3.querySelector('a').style.color = '#0011ff';
    });
}

hoverable4.addEventListener('mouseover', function () {
    target4.style.display = 'block';
    hoverable4.style.background = ' #0000003d';
    hoverable4.querySelector('a').style.color = '#ffffff';
});
target4.addEventListener('mouseleave', function () {
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff';
});
target4.addEventListener('click', function () {
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable4.length; i++) {
    allhoverable4[i].addEventListener("mouseover", function () {
        target4.style.display = 'none';
        hoverable4.style.background = ' none';
        hoverable4.querySelector('a').style.color = '#0011ff';
    });
}

hoverable5.addEventListener('mouseover', function () {
    target5.style.display = 'block';
    hoverable5.style.background = ' #0000003d';
    hoverable5.querySelector('a').style.color = '#ffffff';
});
target5.addEventListener('mouseleave', function () {
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
});
target5.addEventListener('click', function () {
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable5.length; i++) {
    allhoverable5[i].addEventListener("mouseover", function () {
        target5.style.display = 'none';
        hoverable5.style.background = ' none';
        hoverable5.querySelector('a').style.color = '#0011ff';
    });
}


hoverable6.addEventListener('mouseover', function () {
    target6.style.display = 'block';
    hoverable6.style.background = ' #0000003d';
    hoverable6.querySelector('a').style.color = '#ffffff';
});
target6.addEventListener('mouseleave', function () {
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
});
target6.addEventListener('click', function () {
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable6.length; i++) {
    allhoverable6[i].addEventListener("mouseover", function () {
        target6.style.display = 'none';
        hoverable6.style.background = ' none';
        hoverable6.querySelector('a').style.color = '#0011ff';
    });
}
hoverable7.addEventListener('mouseover', function () {
    target7.style.display = 'block';
    hoverable7.style.background = ' #0000003d';
    hoverable7.querySelector('a').style.color = '#ffffff';
});
target7.addEventListener('mouseleave', function () {
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';
});
target7.addEventListener('click', function () {
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';
});
for (let i = 0; i < allhoverable7.length; i++) {
    allhoverable7[i].addEventListener("mouseover", function () {
        target7.style.display = 'none';
        hoverable7.style.background = ' none';
        hoverable7.querySelector('a').style.color = '#0011ff';
    });
}



hoverable1.addEventListener("mouseover", function () {
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff'
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';
});
hoverable.addEventListener("mouseover", function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff'
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';

});
hoverable2.addEventListener("mouseover", function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff'
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';

});

hoverable3.addEventListener("mouseover", function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff';
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';

});
hoverable4.addEventListener("mouseover", function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';

});

hoverable5.addEventListener("mouseover", function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff';
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';
});

hoverable6.addEventListener("mouseover", function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff';
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
    target7.style.display = 'none';
    hoverable7.style.background = ' none';
    hoverable7.querySelector('a').style.color = '#0011ff';
});


hoverable7.addEventListener("mouseover", function () {
    target1.style.display = 'none';
    hoverable1.style.background = ' none';
    hoverable1.querySelector('a').style.color = '#0011ff';
    target.style.display = 'none';
    hoverable.style.background = ' none';
    hoverable.querySelector('a').style.color = '#0011ff';
    target2.style.display = 'none';
    hoverable2.style.background = ' none';
    hoverable2.querySelector('a').style.color = '#0011ff';
    target3.style.display = 'none';
    hoverable3.style.background = ' none';
    hoverable3.querySelector('a').style.color = '#0011ff';
    target4.style.display = 'none';
    hoverable4.style.background = ' none';
    hoverable4.querySelector('a').style.color = '#0011ff';
    target5.style.display = 'none';
    hoverable5.style.background = ' none';
    hoverable5.querySelector('a').style.color = '#0011ff';
    target6.style.display = 'none';
    hoverable6.style.background = ' none';
    hoverable6.querySelector('a').style.color = '#0011ff';
});

document.addEventListener('click', clickOutsideDiv4);
function clickOutsideDiv4(event) {
    var div2 = document.querySelectorAll('.list_detection2');
    var div = document.querySelector('.list_detection');
    for (let i = 0; i < div2.length; i++) {
        if (!div2[i].contains(event.target)) {
            ele_id = document.getElementById(div2[i].id)
            ele_id.style.display = 'none';
            // console.log(div2[i].id)
            // document.removeEventListener('click', clickOutsideDiv4);
        }
    };
};
function toggleDiv() {
    var div = document.querySelector('.list_detection');
    if (div.style.display === 'none' || div.style.display === '') {
        div.style.display = 'block';
        // Add event listener to hide div when clicking outside
        setTimeout(function () {
            document.addEventListener('click', clickOutsideDiv1);
        }, 1);
    } else {
        div.style.display = 'none';
        // Remove event listener when div is hidden
        document.removeEventListener('click', clickOutsideDiv1);
    }
}

function clickOutsideDiv1(event) {
    var div = document.querySelector('.list_detection');
    // if ((div.contains(event.target.innerHTML)) == "kkkonitoring Projects") {
    //     div.style.display = 'block';
    //     document.addEventListener('click', clickOutsideDiv1);
    // }
    if (!div.contains(event.target)) {
        // target.style.display = 'none';
        div.style.display = 'none';
        document.removeEventListener('click', clickOutsideDiv1);
    }
    else if (div.contains(event.target)) {
        try {
            if (event.target.innerHTML === "Monitoring Projects", "Land Management", "Forestry", "Agriculture", "Mineral Resources Management", "Water Resources Management") {
                div.style.display = 'block';
                ele_id = event.target.id + "_Menu"
                ele_catch = document.getElementById(ele_id)
                // console.log(ele_id);
                ele_catch.style.display = 'block';
                document.addEventListener('click', clickOutsideDiv1);
                console.log(div.contains(event.target))
            }
        } catch (e) {
            div.style.display = 'none';
            console.log("else is work")
            document.removeEventListener('click', clickOutsideDiv1);
        }
    }
}


function toggleDiv3() {
    var div = document.querySelector('.list_detection1');
    if (div.style.display === 'none' || div.style.display === '') {
        div.style.display = 'block';
        // Add event listener to hide div when clicking outside
        setTimeout(function () {
            document.addEventListener('click', clickOutsideDiv2);
        }, 1);
    } else {
        div.style.display = 'none';
        // Remove event listener when div is hidden
        document.removeEventListener('click', clickOutsideDiv2);
    }
}
function clickOutsideDiv2(event) {
    var div = document.querySelector('.list_detection1');
    var div2 = document.querySelectorAll('.list_detection2');
    if (!div.contains(event.target) || div2.contains(event.target)) {
        div.style.display = 'none';
        document.removeEventListener('click', clickOutsideDiv2);
        document.getElementById("dropdownUser3").classList.remove('active');
        // document.getElementById("Home").classList.add('active');
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', event => {
                setActive(event.currentTarget.id);
            });
        });
    }
    else if (div.contains(event.target)) {
        div.style.display = 'none';
        document.removeEventListener('click', clickOutsideDiv2);
    }
}


// ~----------------------------- servise icon & effect (hover)--------------------------------// 


const detection_icon = document.querySelector('.detection_icon');
const icon_land = document.getElementById("icon_land")
detection_icon.addEventListener('mouseover', function () {
    icon_land.setAttribute("src", "https://img.icons8.com/ios/ffffff/country--v1.png");
});
detection_icon.addEventListener('click', function () {
    icon_land.setAttribute("src", "https://img.icons8.com/ios/ffffff/country--v1.png");
});
detection_icon.addEventListener('focus', function () {
    icon_land.setAttribute("src", "https://img.icons8.com/ios/ffffff/country--v1.png");
});
detection_icon.addEventListener('mouseleave', function () {
    icon_land.setAttribute("src", "https://i.ibb.co/xS2wWBRP/icons8-country-100.png");
});



// *------------------------- Login page------------------------//


// const login_logo = document.querySelectorAll("#V_logo path");

// for(let i = 0; i < login_logo.length; i++){
//     console.log(` element ${i} is ${login_logo[i].getTotalLength()}`);
// }
// $(document).ready(function(){
//     $('.play').click(function () {
//         if($(this).parent().prev().get(0).paused){
//             $(this).parent().prev().get(0).play();
//             $(this).parent().prev().removeClass('blurEffect');
//             $('.content').hide();
//         }
//     });

//     $('.video').on('ended',function(){
//         $(this).addClass('blurEffect');
//     $('.content').show();
//     });
// })



// ^-------------------------=============== Video Function ==============------------------------//

// controls.innerHTML = "►";
// controls.addEventListener("click", function () {
//     if (controls.innerHTML === "►") {
//         controls.innerHTML = "||";
//         vid.play();
//         console.log("Play video");
//     } else {
//         controls.innerHTML = "►";
//         vid.pause();
//         console.log("Pause video");
//     }
// });
// vid.addEventListener("play", (event) => {
//     controls.innerHTML = "||";
//     console.log("Play video");
// });
// vid.addEventListener("pause", (event) => {
//     controls.innerHTML = "►";
//     console.log("Play video");
// });

// video_container.addEventListener("mouseleave", function () {
//     if (!vid.paused) {
//         controls.style.display = "none";
//     }
// });

// video_container.addEventListener("mouseover", function () {
//     controls.style.display = "flex";
// });

// vid.addEventListener("ended", function () {
//     controls.style.display = "flex";
//     controls.innerHTML = "►";
// });

