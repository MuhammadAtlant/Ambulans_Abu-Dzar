/* Lengkapi data resmi di sini. Biarkan null sampai data dikonfirmasi.
 * WhatsApp: format internasional, misalnya 62812..., tanpa tanda +.
 * Maps: isi alamat lengkap atau koordinat latitude,longitude pada query.
 */
window.SITE_CONFIG = {
  name: 'Ambulans Abu Dzar',
  whatsapp: null,
  whatsappDisplay: null,
  address: 'Ambulans Gratis Abu Dzar Peduli',
  mapsQuery: '-6.2946077,106.701055',
  mapsUrl: 'https://maps.app.goo.gl/5L5i8D5eSPCheFKH7',
  mapIsExample: false,
  donation: { bank: 'BSI — Bank Syariah Indonesia', account: '7887997939', accountDisplay: '788 799 7939', holder: null },
  // Setiap album memiliki daftar foto sendiri. Tambahkan foto asli pada items
  // dengan format { image: 'assets/nama-foto.jpg', alt: 'Deskripsi foto', caption: 'Keterangan' }.
  // Hapus item bertipe illustration ketika foto dokumentasi asli tersedia.
  galleries: [
    {
      id: 'patients',
      title: 'Kegiatan Perjalanan',
      items: [
        { image: 'assets/pengantaran-pasien-igd-01.jpeg', alt: 'Ambulans Abu Dzar berada di depan pintu instalasi gawat darurat', caption: 'Pengantaran pasien ke IGD — armada di area gawat darurat.' },
        { image: 'assets/kedukaan.jpeg', alt: 'Layanan pengantaran jenazah', caption: 'Pengantaran jenazah menuju ke terminal alam barzah' }
      ]
    },
    {
      id: 'maintenance',
      title: 'Perawatan Ambulans',
      items: [
        { image: 'assets/cuci.jpeg', alt: 'Mencuci ambulans untuk menjaga kebersihan dan kenyamanan', caption: 'Mencuci ambulans setelah dipakai agar bersih kembali' },
         { image: 'assets/mainten.jpeg', alt: 'Melakukan servis berkala ke bengkel', caption: 'Ambulans sedang dilakukan pengecekan oleh mekanik' }
      ]
    },
    {
      id: 'volunteers',
      title: 'Bersama Relawan',
      items: [
         { image: 'assets/relawan.jpeg', alt: 'Sinergitas tim relawan Ambulans Abu Dzar', caption: 'Sesi Potret kebersamaan tim relawan Ambulans Abu Dzar' }

      ]
    }
  ]
};
