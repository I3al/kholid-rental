# Scalping XAUUSD — Indikator Zona OB / SL / TP Otomatis

Indikator Pine Script yang **otomatis menandai chart TradingView** kamu supaya tidak asal entry:
EMA tren, garis Support/Resistance, Order Block, serta garis **Entry / SL / TP1 / TP2** lengkap dengan Risk:Reward saat muncul sinyal valid.

> ⚠️ **Disclaimer:** Alat bantu edukasi, **bukan nasihat keuangan**. SL bisa kena — itu normal. Kunci profit = disiplin + Risk:Reward positif jangka panjang.

## Cara Pasang di TradingView
1. Buka chart **XAUUSD** di TradingView.
2. Klik menu **Pine Editor** (bawah layar).
3. Hapus isi default, lalu **copy-paste** seluruh isi `scalping_xauusd.pine`.
4. Klik **Save** → beri nama → klik **Add to chart**.
5. (Opsional) Klik ⚙️ untuk ubah pengaturan (EMA, RR, sesi, sensitivitas swing).

## Cara Setel Alert (biar HP bunyi saat setup muncul)
1. Klik ikon **jam ⏰ (Alert)** di TradingView.
2. Condition: pilih indikator **"Scalping XAUUSD - OB SL TP"** → **Sinyal BUY** / **Sinyal SELL**.
3. Pilih notifikasi (App/Email/Popup) → **Create**.

## Cara Baca Chart
| Tanda | Arti |
|-------|------|
| Garis Aqua/Orange/Merah | EMA 9 / 21 / 50 (arah tren) |
| Garis putus hijau/merah | Support / Resistance otomatis |
| Kotak hijau/merah | Order Block (zona minat harga) |
| ▲ BUY / ▼ SELL | Sinyal entry (pullback ke EMA21 searah tren) |
| Garis biru | Entry |
| Garis merah | Stop Loss |
| Garis teal putus | TP1 & TP2 (dengan Risk:Reward) |
| Tabel kanan atas | Ringkasan Tren, RSI, Sesi, Bias |

## Logika Sinyal (anti asal entry)
Sinyal **BUY** hanya muncul jika **semua** terpenuhi:
- Tren EMA naik (EMA9 > EMA21 > EMA50)
- Harga pullback menyentuh EMA21 lalu ditutup di atasnya
- RSI sehat (40–70, tidak overbought)
- Berada di sesi aktif (London/NY)

Sinyal **SELL** = kebalikannya. Kalau kondisi tidak lengkap → **tidak ada sinyal** (kamu diam = benar).

## Tips
- Timeframe scalping: **M5 / M15**. Pakai **H1/H4** untuk konfirmasi arah besar.
- Jangan entry saat **news high-impact** (NFP, CPI, FOMC).
- Selalu pakai **SL**; jangan geser SL karena "sebentar lagi balik".
