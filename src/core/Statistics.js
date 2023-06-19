let isChanged = true

function fillWithStats() {
    if(isChanged) {
        let stats = JSON.parse(getLocalStorageItem('stats'))
        if(stats === null) {
            stats = []
        }
        for (let idx = stats.length - 1; idx >= 0; idx --) {
            let stat = stats[idx]
            let tr = document.createElement('tr')
            let parsed = JSON.parse(stat);
            for (let idx in parsed) {
                let td = document.createElement('td')
                td.innerText = idx === 'date' ? getDate(new Date(parsed[idx])) : parsed[idx]
                tr.append(td)
            }
            $('.scroll-table-body').find('tbody').append(tr);
        }
        isChanged = false
    }
}

function statsUpdate() {
    isChanged = true
}