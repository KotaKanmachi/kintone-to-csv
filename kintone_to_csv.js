const companyId = 327;
async function make_app_list() {
    const appList = await get_kintone_app(companyId);
    const appTable = document.getElementById("app_list");
    for (const app of appList) {
        const tr = document.createElement("tr");
        const tdAppName = document.createElement("td");
        const tdButton = document.createElement("td");
        tdButton.className = "action";
        const button = document.createElement("button");
        button.onclick = get_kintone_records(companyId, app["アプリ番号"].value);
        tdButton.appendChild(button);
        tr.appendChild(tdAppName);
        tr.appendChild(tdButton);
        appTable.appendChild(tr);
    }
}

async function get_kintone_app(companyId) {
  /* https://nkr-group.cybozu.com/k/3776/*/
  const requestParam = {
    id: 3776,
    query_params: [
      {
        key: "会社レコード番号",
        operator: "=",
        value: companyId,
      },
    ],
    fields: ["表示名", "アプリ番号"],
  };

  try {
    const response = await fetch(endpoint + "/getRecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestParam),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const appList = data.records;
    return appList
  } catch (error) {
    console.error("Error:", error); // エラーハンドリング
  }
}

async function get_kintone_records(companyId, appId) {
    const client = new KintoneRestAPIClient();
    const res = await client.record.getAllRecords({app: appId, condition: `会社レコード番号 = ${companyId}`});
    console.log(res)
}


make_app_list();