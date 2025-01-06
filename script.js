let isScanning = false;

document.getElementById('startScan').addEventListener('click', function () {
  document.getElementById('scanner').style.display = "block";
  isScanning = false; // フラグリセット
  startScanner();
});

function startScanner() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.getElementById('scanner'),
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment",
        },
      },
      decoder: {
        readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"],
      },
    },
    function (err) {
      if (err) {
        console.error("QuaggaJSの初期化エラー:", err);
        alert("カメラの初期化に失敗しました。");
        return;
      }
      console.log("QuaggaJSが正常に初期化されました。");
      Quagga.start();
    }
  );

  Quagga.onDetected(function (result) {
    if (isScanning) return; // 二重実行を防止
    isScanning = true;

    if (result && result.codeResult) {
      const code = result.codeResult.code;
      console.log("検出されたバーコード:", code);

      // 結果を表示
      document.getElementById('barcodeResult').textContent = code;

      // 読み取り音を再生
      const audio = new Audio('scan.mp3'); // 読み取り音のパスを指定
      audio.play();

      // カメラを停止
      Quagga.stop();
      console.log("QuaggaJSが停止しました。");

      // カメラビューを非表示
      document.getElementById('scanner').style.display = "none";

      // 2秒後に指定URLへ遷移
      setTimeout(() => {
        window.location.href = "https://user0888361.github.io/menu/";
      }, 2000); // 2秒後にリダイレクト（必要に応じて調整）

      // フラグをリセット（再スキャン時にリセットする場合）
      isScanning = false;
    }
  });
}
