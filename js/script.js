
let loadData = async () => {
    const url = "../data.json";
    const response = await fetch(url);
    const json = await response.json();
    var res = [];
    json.forEach(element => {
        var newelement = {
            name: element.name,
            date: element.date.map((x) => x.toString().padStart(2, '0')).join('.'),
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
            <th>название стрима</th>
            <th>категории стрима</th>
        </tr>`;
    data.forEach(element => {
        var htmlel = `
            <tr>
                <td>${element.date}</td>
                <td><a href="${element.link}">${element.name}</a></td>
                ` +
                (element.categories == null ? `<td>Нету информации!</td>` : `<td><ul>
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

var fuse = 0, data = 0;

window.onload = async () => {
    data = await loadData();
    data.reverse();
    fuse = new Fuse(data, {keys: ["name", "categories", "date"]});
    search();
};