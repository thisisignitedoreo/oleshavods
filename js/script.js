
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

var loaded = 0;
var perLoad = 30;

let renderData = (data, load) => {
    document.getElementById("main").innerHTML = `
        <tr>
            <th>#</th>
            <th>дата стрима</th>
            <th>теги</th>
            <th>название стрима</th>
            <th>категории стрима</th>
        </tr>`;
    for (let i = 0; i < load; i++) {
        if (data.length <= i) break;
        var element = data[i];
        var htmlel = `
            <tr id="${element.date}">
                <td><a href="#${element.date}" class="goto-link">#</a></td>
                <td>${element.date}</td>
                <td>` + element.tags.map((x) => `<span class="tag" onclick="document.getElementById('search').value = '#${x}'; search();">${x}</span>`).join('') + `</td>
                <td>` + (element.link == null ? `<span onclick="alert('cтрим фактически еще не залит, но уже в списке потому-что скоро будет залит/еще заливается.');">${element.name}</span>` : `<a href="${tg_prefix}/${element.link}">${element.name}</a>`) + `</td>
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
    }
    if (load < data.length) {
        document.getElementById("main").innerHTML += "<tr id=\"load-more\"><td></td><td></td><td></td><td><span style=\"text-decoration: underline; cursor: pointer;\" onclick=\"loadMore();\">загрузить еще</span></td><td></td></tr>";
    }
};

let renderSearched = () => {
    var searchText = document.getElementById("search").value;
    if (!searchText) renderData(data, loaded);
    else if (searchText.startsWith("#")) {
        var filtered = data.filter((x) => x.tags.includes(searchText.slice(1))).toSorted(dateToInt);
        renderData(filtered, loaded);
    }
    else renderData(fuse.search(searchText), loaded);
};

let loadMore = () => {
    loaded = loaded + perLoad;
    renderSearched(data);
};

let dateToInt = (x, y) => {
    var els1 = x.date.split('.').map((x) => parseInt(x));
    var els2 = y.date.split('.').map((x) => parseInt(x));
    var a = (els1[0] + els1[1]*100 + els1[2]*10000);
    var b = (els2[0] + els2[1]*100 + els2[2]*10000);
    return !order ? b - a : a - b;
};

let search = () => {
    loaded = perLoad;
    renderSearched();
};

let reverse = () => {
    data.reverse();
    order = !order;
    search();
}

var fuse, data, order = false;
var tg_prefix = "https://t.me/c/2016603750";
var tg_invite = "https://t.me/oleshavods";

window.onload = async () => {
    data = await loadData();
    document.getElementById("tglink").href = tg_invite;
    data.reverse();
    fuse = new Fuse(data, {keys: ["name", "categories", "date"]});
    /*if (window.location.search) {
        document.getElementById("search").value = decodeURI(window.location.search.slice(1));
    }*/
    search();
    /*if (window.location.hash) {
        document.getElementById(window.location.hash.slice(1)).scrollIntoView();
    }*/
    document.getElementById("info").innerHTML = `стримы заливаются с 10.02.2024, всего залито ${data.length} стримов(-а)`;
};
