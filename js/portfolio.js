async function loadProjects() {
    const response = await fetch("./data/portfolioData.json"); //try to find data
    const projects = await response.json(); //try to get data from json, wait for data

    return projects;
}

let projects = [];

async function init() {
    projects = await loadProjects();
    renderProjects(projects);

    //add listeners to each dropdown
    document.querySelectorAll(".dropdown select").forEach(select => {
        select.addEventListener("change", SortProjects);
    });
}

init();

function renderProjects(projects) {

    let projectNodeTemplate = document.getElementById("template-project");
    let projectParent = document.getElementById("project-container");

    let newProjectNode;

    // projectParent.querySelectorAll(".rendered-project").forEach(node => node.remove()); //remove old projects

    //loop through json objs in projects
    for (let project of projects) {

        newProjectNode = projectNodeTemplate.content.firstElementChild.cloneNode(true); //clone template

        newProjectNode.id = project.id;                 //update id attribute to project id

        //datasets for filtering
        newProjectNode.dataset.projectId = project.id;
        newProjectNode.dataset.year = project.year;
        newProjectNode.dataset.duration = project.duration;
        newProjectNode.dataset.teamSize = project.teamSize;
        newProjectNode.dataset.framework = project.framework;
        newProjectNode.dataset.platform = project.platform;

        //add content
        if (project.vidUrl) {
            let vidParent = newProjectNode.querySelector(".project-videos");

            let vidElement = document.createElement("video");
            vidElement.src = project.vidUrl;
            vidElement.autoplay = true;
            vidElement.muted = true;
            vidElement.loop = true;
            vidElement.playbackRate = 2;
            vidElement.classList.add("project-video");
            vidParent.appendChild(vidElement);
        }

        if (project.imageUrls) {
            let imageParent = newProjectNode.querySelector(".project-images");
            console.log(imageParent);
            for (let imageUrl of project.imageUrls) {
                let imageElement = document.createElement("img");

                imageElement.src = imageUrl;
                imageElement.classList.add("project-image");

                imageParent.appendChild(imageElement);
            }
        }

        newProjectNode.querySelector(".project-name").innerText = project.name;
        newProjectNode.querySelector(".project-text").innerHTML = project.description;

        //tags
        let tagParent = newProjectNode.querySelector(".project-tags");
        let tagTemplate = tagParent.firstElementChild;

        AddTag(project.year, "year", tagParent, tagTemplate);
        AddTag(project.duration, "duration", tagParent, tagTemplate);
        AddTag(project.teamSize, "team-size", tagParent, tagTemplate);
        AddTag(project.framework, "framework", tagParent, tagTemplate);
        AddTag(project.platform, "platform", tagParent, tagTemplate);


        projectParent.appendChild(newProjectNode);
    }
}

function AddTag(tagContent, tagClass, tagParent, tagTemplate) {
    let newTag = tagTemplate.cloneNode(true);
    newTag.classList.remove("template");
    newTag.classList.add(tagClass);
    newTag.innerHTML = tagContent;
    tagParent.appendChild(newTag);
}

function SortProjects() {
    const year = document.querySelector(".year select").value;
    const teamSize = document.querySelector(".team-size select").value;
    const framework = document.querySelector(".framework select").value;
    const duration = document.querySelector(".duration select").value;
    const platform = document.querySelector(".platform select").value;

    const projects = document.querySelectorAll("#project-container .single-project-container");

    projects.forEach(project => {
        const matches =
            (year === "any" || project.dataset.year === year) &&
            (teamSize === "any" || project.dataset.teamSize === teamSize) &&
            (framework === "any" || project.dataset.framework === framework) &&
            (duration === "any" || project.dataset.duration === duration) &&
            (platform === "any" || project.dataset.platform === platform);

        project.style.display = matches ? "" : "none";
    });
    console.log("sorted projects!");
}
