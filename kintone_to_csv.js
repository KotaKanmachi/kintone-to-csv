const endpoint = "https://kintone-relay-api-eidnwbgjma-an.a.run.app";
// const endpoint = "http://localhost:3000";
const companyId = 327;
async function make_app_list() {
  const appList = await get_kintone_app(companyId);
  const appTable = document.getElementById("app_list");
  for (const app of appList) {
    const tr = document.createElement("tr");
    const tdAppName = document.createElement("td");
    tdAppName.innerText = app["表示名"].value;
    const tdButton = document.createElement("td");
    tdButton.className = "action";
    const button = document.createElement("button");
    button.textContent = "scvファイルをダウンロード";
    button.onclick = () =>
      get_kintone_records(
        companyId,
        app["アプリ番号"].value,
        app["表示名"].value
      );
    tdButton.appendChild(button);
    tr.appendChild(tdAppName);
    tr.appendChild(tdButton);
    appTable.appendChild(tr);
  }
}

async function get_kintone_records(companyId, appId, appName) {
  const requestParam = {
    id: appId,
    query_params: [
      {
        key: "会社レコード番号",
        operator: "=",
        value: companyId,
      },
    ],
    fields: [],
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
    const res = data.records;
    const csvData = jsonToCsv(res);
    downloadCsv(csvData, `${appName}.csv`);
  } catch (error) {
    console.error("Error:", error); // エラーハンドリング
  }
}

async function get_kintone_records(companyId, appId, appName) {
  const client = new KintoneRestAPIClient();
  const res = await client.record.getAllRecords({
    app: appId,
    condition: `会社レコード番号 = ${companyId}`,
  });
  const csvData = jsonToCsv(res);
  downloadCsv(csvData, `${appName}.csv`);
}

// JSONをCSVに変換する関数
function jsonToCsv(json) {
  const csvRows = [];
  const excludedFields = [
    "$id",
    "$revision",
    "作成日時",
    "会社レコード番号",
    "作成者",
    "更新日時",
    "更新者",
    "レコード番号",
  ];

  const headers = [
    "レコード番号",
    ...Object.keys(json[0]).filter((field) => !excludedFields.includes(field)),
  ];
  csvRows.push(headers.join(","));

  for (const row of json) {
    const values = headers.map((header) => {
      if (header === "レコード番号") {
        return row["レコード番号"] ? row["レコード番号"].value : "";
      }
      const field = row[header];
      return field ? field.value : "";
    });
    csvRows.push(values.join(","));
  }

  return "\uFEFF" + csvRows.join("\n");
}

// CSVファイルをダウンロードするためのリンクを作成
function downloadCsv(csv, filename) {
  const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(csvBlob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

make_app_list();
