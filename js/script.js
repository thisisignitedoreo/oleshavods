
let loadData = async () => {
    const url = "../data.json";
    const response = await fetch(url);
    const json = await response.json();
    var res = [];
    json.forEach(element => {
        var newelement = {
            name: element.name,
            date: element.date.map((x) => x.toString().padStart(2, '0')).join('.'),
            tags: element.tags,
            categories: element.categories,
            link: element.link,
        };
        res.push(newelement);
    });
    return res;
};

let renderData = (data) => {
    document.getElementById("main").innerHTML = `
        <tr>
            <th>#</th>
            <th>дата стрима</th>
            <th>теги</th>
            <th>название стрима</th>
            <th>категории стрима</th>
        </tr>`;
    data.forEach(element => {
        var htmlel = `
            <tr id="${element.date}">
                <td><a href="#${element.date}" class="goto-link">#</a></td>
                <td>${element.date}</td>
                <td>` + element.tags.map((x) => `<span class="tag" onclick="document.getElementById('search').value = '#${x}'; search();">${x}</span>`).join('') + `</td>
                <td>` + (element.link == null ? `<span onclick="alert('cтрим фактически еще не залит, но уже в списке потому-что скоро будет залит/еще заливается.');">${element.name}</span>` : `<a href="${element.link}">${element.name}</a>`) + `</td>
                ` +
                (element.categories == null ? `<td>нету информации!</td>` : `<td><ul>
                    ` +
                    element.categories.map((x) => `<li>${x}</li>`).join('')
                    + `
                </ul></td>`) +
                `
            </tr>
        `;
        document.getElementById("main").innerHTML += htmlel;
    });
}

let dateToInt = (x, y) => {
    var els1 = x.date.split('.').map((x) => parseInt(x));
    var els2 = y.date.split('.').map((x) => parseInt(x));
    var a = (els1[0] + els1[1]*100 + els1[2]*10000);
    var b = (els2[0] + els2[1]*100 + els2[2]*10000);
    console.log(a);
    console.log(b);
    return !order ? b - a : a - b;
};

let search = () => {
    var searchText = document.getElementById("search").value;
    if (window.history.replaceState) {
        window.history.replaceState({}, "", window.location.origin + window.location.pathname + "?" + searchText + window.location.hash);
    }
    if (!searchText) renderData(data);
    else if (searchText.startsWith("#")) {
        var filtered = data.filter((x) => x.tags.includes(searchText.slice(1))).toSorted(dateToInt);
        renderData(filtered);
    }
    else renderData(fuse.search(searchText));
};

let reverse = () => {
    data.reverse();
    order = !order;
    search();
}

var fuse, data, order = false;

window.onload = async () => {
    data = await loadData();
    data.reverse();
    fuse = new Fuse(data, {keys: ["name", "categories", "date"]});
    if (window.location.search) {
        document.getElementById("search").value = decodeURI(window.location.search.slice(1));
    }
    search();
    if (window.location.hash) {
        document.getElementById(window.location.hash.slice(1)).scrollIntoView();
    }
    document.getElementById("info").innerHTML = `стримы заливаются с 19.02.2024, всего залито ${data.length} стримов(-а)`;
};
