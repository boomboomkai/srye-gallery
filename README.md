# 許瑞月個人作品藝廊

水墨・仕女・山水花鳥。純靜態網站(HTML / CSS / JavaScript),不需要建置,可直接部署到 GitHub Pages。

## 部署到 GitHub Pages

1. 在 GitHub 建立新的 repository(例如 `xu-ruiyue-gallery`)。
2. 把這個資料夾裡的所有檔案上傳到 repository 的根目錄(`index.html` 要在最外層)。
3. 進入 **Settings → Pages**,**Source** 選 `Deploy from a branch`,Branch 選 `main`、資料夾選 `/ (root)`,按 **Save**。
4. 等約 1 分鐘,網址會是 `https://你的帳號.github.io/repository名稱/`。

## 資料夾結構

```
index.html        頁面結構與文字(關於藝術家、教學影片連結等)
css/style.css     樣式
js/data.js        作品資料與圖片路徑
js/app.js         頁面互動
images/works/     作品圖片
images/portrait.jpg  藝術家照片
```

## 新增作品

1. 把圖片放進 `images/works/`(建議寬度 700 到 1200 px 的 JPG)。
2. 打開 `js/data.js`,在 `IMG` 陣列最後加上圖片路徑。
3. 在 `W` 陣列最後加上一筆資料,順序要和 `IMG` 對應:

```js
["荷塘","花鳥","待補","水墨設色","筆墨、紙本",1,"作品說明",["荷"]]
```

分類:人物、花鳥、山水、走獸、書法、文創。系列編號:0 水墨仕女、1 花鳥與松、2 山水、3 團扇與小品、4 書法、5 走獸。

> 首頁的掛軸由 `js/app.js` 裡的 `FEAT` 清單(作品名稱)決定,可自行更換。
