
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
            <th>дата стрима</th>
            <th>теги</th>
            <th>название стрима</th>
            <th>категории стрима</th>
        </tr>`;
    data.forEach(element => {
        var htmlel = `
            <tr>
                <td>${element.date}</td>
                <td>` + (element.tags !== undefined && element.tags.length !== 0 ? `<span class="tag">${element.tags.join('</span><span class="tag">')}</span>` : `тегов нет!`) + `</td>
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

let search = () => {
    var searchText = document.getElementById("search").value;
    if (searchText) renderData(fuse.search(searchText));
    else renderData(data);
};

let reverse = () => {
    data.reverse();
    search();
}

var fuse = 0, data = 0;

window.onload = async () => {
    data = await loadData();
    data.reverse();
    fuse = new Fuse(data, {keys: ["name", "categories", "date", "tags"]});
    search();
    document.getElementById("info").innerHTML = `стримы заливаются с 19.02.2024, всего залито ${data.length} стримов(-а)`;
};
