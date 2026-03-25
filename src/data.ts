export interface Vocabulary {
  word: string;
  reading: string;
  meaning: string;
  level: 'N5' | 'N4';
  imageSeed: string;
}

export interface Kanji {
  character: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
  level: 'N5' | 'N4';
  strokes: number;
  radical: string;
}

export interface Grammar {
  pattern: string;
  explanation: string;
  example: string;
  exampleTranslation: string;
  level: 'N5' | 'N4';
}

export interface Reading {
  title: string;
  content: string;
  translation: string;
  level: 'N5' | 'N4';
}

export interface Conversation {
  title: string;
  dialogue: { speaker: string; text: string; translation: string }[];
  level: 'N5' | 'N4';
}

export const vocabularyData: Vocabulary[] = [
  // N5
  { word: '食べる', reading: 'たべる', meaning: 'Makan', level: 'N5', imageSeed: 'food' },
  { word: '飲む', reading: 'のむ', meaning: 'Minum', level: 'N5', imageSeed: 'drink' },
  { word: '行く', reading: 'いく', meaning: 'Pergi', level: 'N5', imageSeed: 'travel' },
  { word: '来る', reading: 'くる', meaning: 'Datang', level: 'N5', imageSeed: 'arrival' },
  { word: '見る', reading: 'みる', meaning: 'Melihat/Menonton', level: 'N5', imageSeed: 'eye' },
  { word: '聞く', reading: 'きく', meaning: 'Mendengar/Bertanya', level: 'N5', imageSeed: 'ear' },
  { word: '話す', reading: 'はなす', meaning: 'Berbicara', level: 'N5', imageSeed: 'talk' },
  { word: '書く', reading: 'かく', meaning: 'Menulis', level: 'N5', imageSeed: 'write' },
  { word: '読む', reading: 'よむ', meaning: 'Membaca', level: 'N5', imageSeed: 'book' },
  { word: '寝る', reading: 'ねる', meaning: 'Tidur', level: 'N5', imageSeed: 'sleep' },
  { word: '学校', reading: 'がっこう', meaning: 'Sekolah', level: 'N5', imageSeed: 'school' },
  { word: '先生', reading: 'せんせい', meaning: 'Guru', level: 'N5', imageSeed: 'teacher' },
  { word: '学生', reading: 'がくせい', meaning: 'Siswa', level: 'N5', imageSeed: 'student' },
  { word: '友達', reading: 'ともだち', meaning: 'Teman', level: 'N5', imageSeed: 'friends' },
  { word: '家族', reading: 'かぞく', meaning: 'Keluarga', level: 'N5', imageSeed: 'family' },
  { word: '日本', reading: 'にほん', meaning: 'Jepang', level: 'N5', imageSeed: 'japan' },
  { word: '日本語', reading: 'にほんご', meaning: 'Bahasa Jepang', level: 'N5', imageSeed: 'language' },
  { word: '水', reading: 'みず', meaning: 'Air', level: 'N5', imageSeed: 'water' },
  { word: 'お茶', reading: 'おちゃ', meaning: 'Teh', level: 'N5', imageSeed: 'tea' },
  { word: 'ご飯', reading: 'ごはん', meaning: 'Nasi/Makanan', level: 'N5', imageSeed: 'rice' },
  { word: '本', reading: 'ほん', meaning: 'Buku', level: 'N5', imageSeed: 'books' },
  { word: '車', reading: 'くるま', meaning: 'Mobil', level: 'N5', imageSeed: 'car' },
  { word: '山', reading: 'やま', meaning: 'Gunung', level: 'N5', imageSeed: 'mountain' },
  { word: '川', reading: 'かわ', meaning: 'Sungai', level: 'N5', imageSeed: 'river' },
  { word: '空', reading: 'そら', meaning: 'Langit', level: 'N5', imageSeed: 'sky' },
  { word: '花', reading: 'はな', meaning: 'Bunga', level: 'N5', imageSeed: 'flower' },
  { word: '犬', reading: 'いぬ', meaning: 'Anjing', level: 'N5', imageSeed: 'dog' },
  { word: '猫', reading: 'ねこ', meaning: 'Kucing', level: 'N5', imageSeed: 'cat' },
  { word: '魚', reading: 'さかな', meaning: 'Ikan', level: 'N5', imageSeed: 'fish' },
  { word: '鳥', reading: 'とり', meaning: 'Burung', level: 'N5', imageSeed: 'bird' },
  // N4
  { word: '準備', reading: 'じゅんび', meaning: 'Persiapan', level: 'N4', imageSeed: 'prepare' },
  { word: '経験', reading: 'けいけん', meaning: 'Pengalaman', level: 'N4', imageSeed: 'experience' },
  { word: '連絡', reading: 'れんらく', meaning: 'Hubungan/Kontak', level: 'N4', imageSeed: 'phone' },
  { word: '相談', reading: 'そうだん', meaning: 'Konsultasi', level: 'N4', imageSeed: 'consult' },
  { word: '反対', reading: 'はんたい', meaning: 'Oposisi/Lawan', level: 'N4', imageSeed: 'oppose' },
  { word: '賛成', reading: 'さんせい', meaning: 'Persetujuan', level: 'N4', imageSeed: 'agree' },
  { word: '注意', reading: 'ちゅうい', meaning: 'Peringatan/Perhatian', level: 'N4', imageSeed: 'caution' },
  { word: '意味', reading: 'いみ', meaning: 'Arti', level: 'N4', imageSeed: 'meaning' },
  { word: '理由', reading: 'りゆう', meaning: 'Alasan', level: 'N4', imageSeed: 'reason' },
  { word: '方法', reading: 'ほうほう', meaning: 'Metode/Cara', level: 'N4', imageSeed: 'method' },
  { word: '技術', reading: 'ぎじゅつ', meaning: 'Teknologi/Teknik', level: 'N4', imageSeed: 'tech' },
  { word: '生活', reading: 'せいかつ', meaning: 'Kehidupan', level: 'N4', imageSeed: 'life' },
  { word: '将来', reading: 'しょうらい', meaning: 'Masa Depan', level: 'N4', imageSeed: 'future' },
  { word: '目的', reading: 'もくてき', meaning: 'Tujuan', level: 'N4', imageSeed: 'target' },
  { word: '習慣', reading: 'しゅうかん', meaning: 'Kebiasaan', level: 'N4', imageSeed: 'habit' },
  { word: '関係', reading: 'かんけい', meaning: 'Hubungan', level: 'N4', imageSeed: 'relation' },
  { word: '複雑', reading: 'ふくざつ', meaning: 'Rumit', level: 'N4', imageSeed: 'complex' },
  { word: '簡単', reading: 'かんたん', meaning: 'Mudah', level: 'N4', imageSeed: 'easy' },
  { word: '不便', reading: 'ふべん', meaning: 'Tidak Praktis', level: 'N4', imageSeed: 'inconvenient' },
  { word: '便利', reading: 'べんり', meaning: 'Praktis', level: 'N4', imageSeed: 'convenient' },
];

export const kanjiData: Kanji[] = [
  { character: '一', onyomi: 'イチ', kunyomi: 'ひと', meaning: 'Satu', level: 'N5', strokes: 1, radical: '一' },
  { character: '二', onyomi: 'ニ', kunyomi: 'ふた', meaning: 'Dua', level: 'N5', strokes: 2, radical: '二' },
  { character: '三', onyomi: 'サン', kunyomi: 'み', meaning: 'Tiga', level: 'N5', strokes: 3, radical: '一' },
  { character: '日', onyomi: 'ニチ、ジツ', kunyomi: 'ひ、か', meaning: 'Hari, Matahari', level: 'N5', strokes: 4, radical: '日' },
  { character: '月', onyomi: 'ゲツ、ガツ', kunyomi: 'つき', meaning: 'Bulan', level: 'N5', strokes: 4, radical: '月' },
  { character: '火', onyomi: 'カ', kunyomi: 'ひ、ほ', meaning: 'Api', level: 'N5', strokes: 4, radical: '火' },
  { character: '水', onyomi: 'スイ', kunyomi: 'みず', meaning: 'Air', level: 'N5', strokes: 4, radical: '水' },
  { character: '木', onyomi: 'モク、ボク', kunyomi: 'き、こ', meaning: 'Pohon', level: 'N5', strokes: 4, radical: '木' },
  { character: '金', onyomi: 'キン、コン', kunyomi: 'かね、かな', meaning: 'Emas, Uang', level: 'N5', strokes: 8, radical: '金' },
  { character: '土', onyomi: 'ド、ト', kunyomi: 'つち', meaning: 'Tanah', level: 'N5', strokes: 3, radical: '土' },
  { character: '人', onyomi: 'ジン、ニン', kunyomi: 'ひと', meaning: 'Orang', level: 'N5', strokes: 2, radical: '人' },
  { character: '大', onyomi: 'ダイ、タイ', kunyomi: 'おお', meaning: 'Besar', level: 'N5', strokes: 3, radical: '大' },
  { character: '小', onyomi: 'ショウ', kunyomi: 'ちい', meaning: 'Kecil', level: 'N5', strokes: 3, radical: '小' },
  { character: '中', onyomi: 'チュウ', kunyomi: 'なか', meaning: 'Tengah', level: 'N5', strokes: 4, radical: '丨' },
  { character: '上', onyomi: 'ジョウ', kunyomi: 'うえ', meaning: 'Atas', level: 'N5', strokes: 3, radical: '一' },
  { character: '下', onyomi: 'カ、ゲ', kunyomi: 'した', meaning: 'Bawah', level: 'N5', strokes: 3, radical: '一' },
  // N4
  { character: '会', onyomi: 'カイ', kunyomi: 'あ-う', meaning: 'Bertemu', level: 'N4', strokes: 6, radical: '人' },
  { character: '同', onyomi: 'ドウ', kunyomi: 'おな-じ', meaning: 'Sama', level: 'N4', strokes: 6, radical: '口' },
  { character: '事', onyomi: 'ジ', kunyomi: 'こと', meaning: 'Hal/Perkara', level: 'N4', strokes: 8, radical: '亅' },
  { character: '自', onyomi: 'ジ、シ', kunyomi: 'みずか-ら', meaning: 'Diri Sendiri', level: 'N4', strokes: 6, radical: '自' },
  { character: '社', onyomi: 'シャ', kunyomi: 'やしろ', meaning: 'Perusahaan/Kuil', level: 'N4', strokes: 7, radical: '示' },
  { character: '発', onyomi: 'ハツ、ホツ', kunyomi: 'た-つ', meaning: 'Berangkat/Mengeluarkan', level: 'N4', strokes: 9, radical: '癶' },
  { character: '者', onyomi: 'シャ', kunyomi: 'もの', meaning: 'Orang (Pelaku)', level: 'N4', strokes: 8, radical: '耂' },
  { character: '地', onyomi: 'チ、ジ', kunyomi: '-', meaning: 'Tanah/Bumi', level: 'N4', strokes: 6, radical: '土' },
  { character: '業', onyomi: 'ギョウ、ゴウ', kunyomi: 'わざ', meaning: 'Pekerjaan/Industri', level: 'N4', strokes: 13, radical: '木' },
  { character: '方', onyomi: 'ホウ', kunyomi: 'かた', meaning: 'Arah/Cara', level: 'N4', strokes: 4, radical: '方' },
];

export const grammarData: Grammar[] = [
  {
    pattern: '〜は〜です',
    explanation: 'Digunakan untuk mendefinisikan subjek.',
    example: '私は学生です。',
    exampleTranslation: 'Saya adalah seorang siswa.',
    level: 'N5'
  },
  {
    pattern: '〜の〜',
    explanation: 'Menunjukkan kepemilikan atau hubungan.',
    example: 'これは私の本です。',
    exampleTranslation: 'Ini adalah buku saya.',
    level: 'N5'
  },
  {
    pattern: '〜てください',
    explanation: 'Digunakan untuk membuat permintaan sopan.',
    example: 'ここで待ってください。',
    exampleTranslation: 'Tolong tunggu di sini.',
    level: 'N5'
  },
  {
    pattern: '〜から〜まで',
    explanation: 'Menunjukkan titik awal dan akhir (waktu atau tempat).',
    example: '９時から５時まで働きます。',
    exampleTranslation: 'Bekerja dari jam 9 sampai jam 5.',
    level: 'N5'
  },
  {
    pattern: '〜がほしい',
    explanation: 'Menunjukkan keinginan terhadap suatu benda.',
    example: '新しい車がほしいです。',
    exampleTranslation: 'Saya ingin mobil baru.',
    level: 'N5'
  },
  // N4
  {
    pattern: '〜たことがある',
    explanation: 'Digunakan untuk membicarakan pengalaman masa lalu.',
    example: '日本へ行ったことがあります。',
    exampleTranslation: 'Saya pernah pergi ke Jepang.',
    level: 'N4'
  },
  {
    pattern: '〜ほうがいい',
    explanation: 'Digunakan untuk memberikan saran.',
    example: '早く寝たほうがいいですよ。',
    exampleTranslation: 'Lebih baik tidur lebih awal.',
    level: 'N4'
  },
  {
    pattern: '〜すぎる',
    explanation: 'Menunjukkan sesuatu yang berlebihan.',
    example: 'この料理は辛すぎます。',
    exampleTranslation: 'Masakan ini terlalu pedas.',
    level: 'N4'
  },
  {
    pattern: '〜つもりです',
    explanation: 'Menunjukkan niat atau rencana.',
    example: '来年、日本へ行くつもりです。',
    exampleTranslation: 'Tahun depan, saya berniat pergi ke Jepang.',
    level: 'N4'
  },
  {
    pattern: '〜ながら',
    explanation: 'Melakukan dua aktivitas secara bersamaan.',
    example: '音楽を聞きながら勉強します。',
    exampleTranslation: 'Belajar sambil mendengarkan musik.',
    level: 'N4'
  },
];

export const readingData: Reading[] = [
  {
    title: 'Keluarga Saya',
    content: '私の家族は四人です。父と母と兄と私です。父は会社員です。母は先生です。兄は大学生です。私たちは毎日一緒に晩ご飯を食べます。',
    translation: 'Keluarga saya ada empat orang. Ayah, ibu, kakak laki-laki, dan saya. Ayah adalah karyawan perusahaan. Ibu adalah guru. Kakak adalah mahasiswa. Kami makan malam bersama setiap hari.',
    level: 'N5'
  },
  {
    title: 'Rencana Akhir Pekan',
    content: '今週の土曜日に友達と映画を見に行きます。その後で、レストランで食事をします。日曜日は家で掃除をしたり、勉強をしたりします。',
    translation: 'Sabtu minggu ini saya akan pergi menonton film bersama teman. Setelah itu, kami akan makan di restoran. Hari Minggu saya akan membersihkan rumah, belajar, dan lain-lain.',
    level: 'N4'
  },
  {
    title: 'Hobi Saya',
    content: '私の趣味は写真を撮ることです。週末はよく公園へ行って、花や鳥の写真を撮ります。時々友達と一緒に旅行に行きます。',
    translation: 'Hobi saya adalah mengambil foto. Akhir pekan saya sering pergi ke taman dan mengambil foto bunga atau burung. Terkadang saya pergi berwisata bersama teman.',
    level: 'N5'
  },
  {
    title: 'Belajar Bahasa Jepang',
    content: '日本語の勉強は難しいですが、とても面白いです。毎日漢字を練習したり、CDを聞いたりします。将来、日本の会社で働きたいです。',
    translation: 'Belajar bahasa Jepang itu sulit, tapi sangat menarik. Setiap hari saya berlatih kanji, mendengarkan CD, dan lain-lain. Di masa depan, saya ingin bekerja di perusahaan Jepang.',
    level: 'N4'
  }
];

export const conversationData: Conversation[] = [
  {
    title: 'Perkenalan Diri (Jiko Shoukai)',
    level: 'N5',
    dialogue: [
      { speaker: 'Tanaka', text: 'はじめまして。田中です。よろしくお願いします。', translation: 'Salam kenal. Saya Tanaka. Mohon bantuannya.' },
      { speaker: 'Ali', text: 'はじめまして。アリです。インドネシアから来ました。よろしくお願いします。', translation: 'Salam kenal. Saya Ali. Saya datang dari Indonesia. Mohon bantuannya.' },
    ]
  },
  {
    title: 'Di Restoran (Resutoran de)',
    level: 'N4',
    dialogue: [
      { speaker: 'Pelayan', text: 'いらっしゃいませ。何名様ですか。', translation: 'Selamat datang. Berapa orang?' },
      { speaker: 'Tamu', text: '二人です。', translation: 'Dua orang.' },
      { speaker: 'Pelayan', text: 'こちらへどうぞ。ご注文はお決まりですか。', translation: 'Silakan lewat sini. Apakah sudah memutuskan pesanan?' },
      { speaker: 'Tamu', text: 'はい、ラーメンを二つお願いします。', translation: 'Ya, tolong ramen dua.' },
    ]
  }
];
