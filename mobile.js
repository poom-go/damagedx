const params = new URLSearchParams(location.search);
const receiptId = params.get("id");

loadReceipt();

async function loadReceipt() {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "get",
      receiptId
    })
  });

  const result = await res.json();

  if (!result.success) {
    document.getElementById("info").innerHTML = "접수 정보를 찾을 수 없습니다.";
    return;
  }

  const item = result.data;

  document.getElementById("info").innerHTML = `
    <p><strong>접수번호:</strong> ${item.receiptId}</p>
    <p><strong>담당자:</strong> ${item.manager}</p>
    <p><strong>고객사:</strong> ${item.client}</p>
    <p><strong>항목:</strong> ${item.type}</p>
    <p><strong>바코드:</strong> ${item.barcode}</p>
    <p><strong>수량:</strong> ${item.qty}</p>
    <p><strong>메모:</strong> ${item.memo || "-"}</p>
  `;
}

async function upload() {
  const files = document.getElementById("photos").files;

  if (files.length < 1) {
    alert("사진 최소 1장 필요");
    return;
  }

  const images = [];

  for (const file of files) {
    const base64 = await toBase64(file);
    images.push({
      data: base64.split(",")[1],
      type: file.type
    });
  }

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "upload",
      receiptId,
      images
    })
  });

  const result = await res.json();

  if (!result.success) {
    alert("업로드 실패");
    return;
  }

  alert(`업로드 완료\n사진개수: ${result.photoCount}`);
}

function toBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
