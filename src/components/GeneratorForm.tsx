import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Plus, Minus, School, User as UserIcon, Briefcase, GraduationCap, Calendar, Clock, BookOpen, Layers, Trash2, FileText } from 'lucide-react';
import { ModulFormData } from '../types';
import { cn } from '../lib/utils';

// Daftar sekolah yang diperbolehkan
const ALLOWED_SCHOOLS = [
  "SD Negeri 1 Merdeka",
  "SD NEGERI 1 MERDEKA",
  "SDN 1 MERDEKA"
];

// Daftar nama guru yang diperbolehkan
const ALLOWED_TEACHERS = [
  "Rista Kasaraeng, S.Pd",
  "RISTA KASARAENG, S.Pd",
  "FIDHAL, S.Pd" 
];

interface GeneratorFormProps {
  onSubmit: (data: ModulFormData) => void;
  isLoading: boolean;
  savedData?: ModulFormData | null; 
  onViewPrevious?: () => void; 
}

const DIMENSI_LULUSAN = [
  'Keimanan & Ketakwaan', 'Kewargaan', 'Penalaran Kritis', 'Kreativitas', 
  'Kolaborasi', 'Kemandirian', 'Kesehatan', 'Komunikasi'
];

const PEDAGOGY_OPTIONS = [
  'Inkuiri-Discovery', 'PjBL', 'Problem Solving', 'Game Based Learning', 'Station Learning'
];

// =====================================================================
// DATA MASTER & FUNGSI UNTUK CAPAIAN PEMBELAJARAN (CP) OTOMATIS
// =====================================================================

// Fungsi untuk menentukan Fase berdasarkan Jenjang dan Kelas
const getFase = (level: string, grade: string): string => {
  const gradeNum = parseInt(grade.replace(/\D/g, ''));
  if (!gradeNum) return '';

  if (level === 'SD') {
    if (gradeNum === 1 || gradeNum === 2) return 'A';
    if (gradeNum === 3 || gradeNum === 4) return 'B';
    if (gradeNum === 5 || gradeNum === 6) return 'C';
  } else if (level === 'SMP') {
    if (gradeNum >= 7 && gradeNum <= 9) return 'D';
  } else if (level === 'SMA' || level === 'SMK') {
    if (gradeNum === 10) return 'E';
    if (gradeNum === 11 || gradeNum === 12) return 'F';
  }
  return '';
};

// Data CP diekstrak dari file BSKAP No. 046 Tahun 2025
const MASTER_CP_DATA = [
  // --- JENJANG SD ---
  { level: 'SD', fase: 'A', subject: 'Pendidikan Pancasila', elemen: 'Pancasila', text: 'Murid mampu mengenal dan menceritakan simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila; menerapkan nilai-nilai Pancasila di lingkungan keluarga dan sekolah.' },
  { level: 'SD', fase: 'A', subject: 'Pendidikan Pancasila', elemen: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945', text: 'Murid mampu mengenal aturan di lingkungan keluarga dan sekolah; menceritakan contoh sikap mematuhi dan tidak mematuhi aturan di keluarga dan sekolah; menyampaikan pendapat di kelas.' },
  { level: 'SD', fase: 'A', subject: 'Bahasa Indonesia', elemen: 'Menyimak', text: 'Murid mampu bersikap menjadi penyimak yang baik; memahami pesan lisan dan informasi dari media audio, teks aural (teks yang dibacakan dan/atau didengar), dan instruksi lisan.' },
  { level: 'SD', fase: 'A', subject: 'Bahasa Indonesia', elemen: 'Membaca dan Memirsa', text: 'Murid mampu memahami informasi dari bacaan dan tayangan yang dipirsa tentang diri dan lingkungan, narasi pendek, serta puisi anak.' },
  { level: 'SD', fase: 'A', subject: 'Matematika', elemen: 'Bilangan', text: 'Murid menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100, membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan operasi penjumlahan dan pengurangan.' },
  { level: 'SD', fase: 'B', subject: 'Pendidikan Pancasila', elemen: 'Bhinneka Tunggal Ika', text: 'Murid mampu mengenal identitas diri, teman, dan warga sekolah sesuai budaya, minat, dan perilakunya; mengenali karakteristik fisik dan non-fisik orang dan benda di lingkungan sekitar.' },
  { level: 'SD', fase: 'B', subject: 'Bahasa Indonesia', elemen: 'Berbicara dan Presentasi', text: 'Murid mampu berbicara dengan pilihan kata dan sikap tubuh/gestur yang santun, menggunakan volume dan intonasi yang tepat sesuai konteks.' },
  { level: 'SD', fase: 'B', subject: 'Matematika', elemen: 'Geometri', text: 'Murid dapat mendeskripsikan ciri berbagai bentuk bangun datar dan bangun ruang; menyusun (komposisi) dan mengurai (dekomposisi) berbagai bangun datar.' },
  { level: 'SD', fase: 'B', subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', elemen: 'Pemahaman IPAS (Sains & Sosial)', text: 'Murid menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia/hewan; siklus hidup makhluk hidup dan pelestariannya; masalah pelestarian lingkungan sekitar.' },
  { level: 'SD', fase: 'C', subject: 'Pendidikan Pancasila', elemen: 'Negara Kesatuan Republik Indonesia', text: 'Murid mampu menjelaskan wilayah NKRI sebagai satu kesatuan utuh; berpartisipasi menjaga keutuhan wilayah NKRI; meneladani perjuangan para pahlawan.' },
  { level: 'SD', fase: 'C', subject: 'Bahasa Indonesia', elemen: 'Menulis', text: 'Murid mampu menulis teks eksplanasi, laporan, dan eksposisi persuasif dengan penyajian yang runtut dan menggunakan ejaan yang disempurnakan (EYD).' },
  { level: 'SD', fase: 'C', subject: 'Matematika', elemen: 'Analisis Data dan Peluang', text: 'Murid dapat mengurutkan, membandingkan, menyajikan, dan menganalisis data banyak benda dan data hasil pengukuran dalam bentuk gambar, piktogram, diagram batang, dan tabel frekuensi.' },
  { level: 'SD', fase: 'C', subject: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', elemen: 'Pemahaman IPAS', text: 'Murid melakukan simulasi dengan menggunakan gambar/bagan/alat bantu sederhana tentang sistem organ tubuh manusia (pencernaan, pernapasan, dan peredaran darah) serta kaitannya dengan kesehatan.' },

  // --- JENJANG SMP ---
  { level: 'SMP', fase: 'D', subject: 'Pendidikan Pancasila', elemen: 'Pancasila', text: 'Peserta didik mampu menganalisis kronologi lahirnya Pancasila; mengkaji fungsi dan kedudukan Pancasila sebagai dasar negara dan pandangan hidup bangsa; mengimplementasikan nilai-nilai Pancasila.' },
  { level: 'SMP', fase: 'D', subject: 'Bahasa Indonesia', elemen: 'Membaca dan Memirsa', text: 'Peserta didik memahami informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari berbagai jenis teks (deskripsi, narasi, puisi, eksplanasi dan eksposisi) baik visual maupun audiovisual.' },
  { level: 'SMP', fase: 'D', subject: 'Matematika', elemen: 'Aljabar', text: 'Peserta didik dapat mengenali, memprediksi dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan; menyatakan suatu situasi ke dalam bentuk aljabar; menyelesaikan persamaan dan pertidaksamaan linear satu variabel.' },
  { level: 'SMP', fase: 'D', subject: 'Ilmu Pengetahuan Alam (IPA)', elemen: 'Pemahaman IPA', text: 'Peserta didik mampu melakukan klasifikasi makhluk hidup dan benda berdasarkan karakteristik yang diamati; mengidentifikasi sifat dan karakteristik zat, membedakan perubahan fisik dan kimia.' },
  { level: 'SMP', fase: 'D', subject: 'Ilmu Pengetahuan Sosial (IPS)', elemen: 'Pemahaman Konsep', text: 'Peserta didik memahami keberadaan diri dan keluarga di tengah lingkungan sosial; menganalisis hubungan antara keragaman kondisi geografis Indonesia dengan pembentukan identitas masyarakat.' },
  { level: 'SMP', fase: 'D', subject: 'Bahasa Inggris', elemen: 'Menyimak - Berbicara', text: 'Peserta didik menggunakan bahasa Inggris untuk berinteraksi dan saling bertukar ide, pengalaman, minat, dan pendapat dengan guru, teman sebaya dan orang lain dalam berbagai macam konteks familiar formal dan informal.' },
  { level: 'SMP', fase: 'D', subject: 'Informatika (Termasuk Koding & AI)', elemen: 'Berpikir Komputasional', text: 'Peserta didik mampu menerapkan berpikir komputasional untuk menghasilkan solusi logis dari persoalan dengan data diskrit bervolume kecil serta struktur data (list, stack, queue). Mampu mengenal dasar-dasar Algoritma dan Pemrograman (Koding).' },

  // --- JENJANG SMA ---
  { level: 'SMA', fase: 'E', subject: 'Pendidikan Pancasila', elemen: 'Pancasila', text: 'Peserta didik mampu menganalisis cara pandang para pendiri negara tentang rumusan Pancasila sebagai dasar negara; mempraktikkan nilai-nilai Pancasila dalam kehidupan sehari-hari sesuai perkembangan zaman.' },
  { level: 'SMA', fase: 'E', subject: 'Matematika', elemen: 'Bilangan', text: 'Peserta didik dapat menggeneralisasi sifat-sifat operasi bilangan berpangkat (eksponen) dan logaritma, serta menggunakan barisan dan deret (aritmetika dan geometri).' },
  { level: 'SMA', fase: 'E', subject: 'Fisika', elemen: 'Pemahaman Sains', text: 'Peserta didik mampu mengamati, menyelidiki, dan menjelaskan fenomena alam yang berkaitan dengan pengukuran fisik, energi alternatif, dan pemanasan global.' },
  { level: 'SMA', fase: 'E', subject: 'Kimia', elemen: 'Pemahaman Sains', text: 'Peserta didik memahami struktur atom, sifat keperiodikan unsur, ikatan kimia, serta penerapan prinsip kimia hijau dalam kehidupan sehari-hari.' },
  { level: 'SMA', fase: 'E', subject: 'Biologi', elemen: 'Pemahaman Sains', text: 'Peserta didik memahami keanekaragaman hayati dan peranannya; virus dan peranannya; serta ekosistem dan aliran energi.' },
  { level: 'SMA', fase: 'E', subject: 'Informatika', elemen: 'Sistem Komputer, Koding & AI', text: 'Peserta didik mampu memahami komponen, fungsi, dan cara kerja komputer; memahami konsep kecerdasan artifisial (AI) tingkat dasar, etika data, dan merancang koding pemrograman struktural.' },
  { level: 'SMA', fase: 'F', subject: 'Bahasa Indonesia', elemen: 'Membaca dan Memirsa', text: 'Peserta didik mampu mengevaluasi gagasan, pikiran, pandangan, atau pesan dari berbagai jenis teks (monolog/dialog/informasional/fiksi) secara kritis dan reflektif.' },
  { level: 'SMA', fase: 'F', subject: 'Matematika (Tingkat Lanjut)', elemen: 'Aljabar dan Fungsi', text: 'Peserta didik dapat melakukan operasi aritmetika pada polinomial (suku banyak), menentukan faktor polinomial, matriks, serta fungsi trigonometri beserta grafiknya.' },

  // --- JENJANG SMK ---
  { level: 'SMK', fase: 'E', subject: 'Matematika (SMK)', elemen: 'Geometri & Trigonometri', text: 'Peserta didik menyelesaikan masalah yang berkaitan dengan perbandingan trigonometri pada segitiga siku-siku serta aplikasinya pada pemecahan masalah konstruksi atau teknik/bisnis.' },
  { level: 'SMK', fase: 'E', subject: 'Projek IPAS (SMK)', elemen: 'Menjelaskan Fenomena secara Ilmiah', text: 'Peserta didik mampu menjelaskan fenomena alam dan sosial di lingkungan kerjanya secara ilmiah, aspek makhluk hidup, zat dan perubahannya, serta energi dan perubahannya.' },
  { level: 'SMK', fase: 'E', subject: 'Dasar-Dasar Program Keahlian (Umum)', elemen: 'Proses Bisnis Dunia Kerja', text: 'Peserta didik mampu memahami proses bisnis secara menyeluruh pada industri/bidang keahlian masing-masing, termasuk K3LH (Keselamatan, Kesehatan Kerja, dan Lingkungan Hidup).' },
  { level: 'SMK', fase: 'F', subject: 'Mata Pelajaran Kejuruan (Spesifik)', elemen: 'Perencanaan & Eksekusi Kerja', text: 'Peserta didik menerapkan kompetensi keahlian spesifik dunia kerja/industri; melaksanakan penjaminan mutu produk/jasa; menggunakan teknologi digital manufaktur atau sistem aplikasi industri terkait.' },
  { level: 'SMK', fase: 'F', subject: 'Projek Kreatif dan Kewirausahaan', elemen: 'Kegiatan Produksi & Kewirausahaan', text: 'Peserta didik mampu menyusun rencana usaha (business plan), membuat produk (barang/jasa) kreatif bernilai ekonomis, melakukan pemasaran digital, serta mengelola keuangan mikro usaha.' },
  { level: 'SMK', fase: 'F', subject: 'Praktik Kerja Lapangan (PKL)', elemen: 'Internalisasi Budaya Kerja', text: 'Peserta didik menginternalisasi budaya kerja dunia industri (disiplin, integritas, kerja tim); mengaplikasikan kompetensi teknis di dunia kerja nyata minimal selama 1 semester penuh.' }
];

export default function GeneratorForm({ onSubmit, isLoading, savedData, onViewPrevious }: GeneratorFormProps) {
  const [formData, setFormData] = useState<ModulFormData>(() => {
    try {
      const localData = localStorage.getItem('tm_generator_form_data');
      if (localData) {
        return JSON.parse(localData);
      }
    } catch (e) {
      console.error("Gagal memuat data dari localStorage", e);
    }

    return {
      schoolName: savedData?.schoolName || '',
      teacherName: savedData?.teacherName || '',
      teacherNip: savedData?.teacherNip || '',
      position: savedData?.position || 'Guru Kelas',
      principalName: savedData?.principalName || '',
      principalNip: savedData?.principalNip || '',
      level: savedData?.level || 'SD',
      grade: savedData?.grade || '',
      semester: savedData?.semester || 'I / Ganjil',
      subject: savedData?.subject || '',
      cp: savedData?.cp || '',
      tp: savedData?.tp || '',
      meetings: savedData?.meetings || 1,
      duration: savedData?.duration || '',
      pedagogy: savedData?.pedagogy || [],
      dimensi: savedData?.dimensi || []
    };
  });

  useEffect(() => {
    localStorage.setItem('tm_generator_form_data', JSON.stringify(formData));
  }, [formData]);

  // Kalkulasi Fase secara Reaktif
  const currentFase = getFase(formData.level, formData.grade);

  // Filter CP berdasarkan Jenjang, Fase, dan kata kunci di Input Mapel
  const availableCPs = MASTER_CP_DATA.filter(cp => {
    const matchLevel = cp.level === formData.level;
    const matchFase = cp.fase === currentFase;
    // Pengecekan fuzzy untuk input mata pelajaran
    const matchSubject = formData.subject 
      ? cp.subject.toLowerCase().includes(formData.subject.toLowerCase()) || formData.subject.toLowerCase().includes(cp.subject.toLowerCase())
      : true; 
    
    return matchLevel && matchFase && matchSubject;
  });

  const handleClearForm = () => {
    if (confirm("Apakah Anda yakin ingin membersihkan semua draf data yang telah diisi?")) {
      localStorage.removeItem('tm_generator_form_data');
      setFormData({
        schoolName: '', teacherName: '', teacherNip: '', position: 'Guru Kelas',
        principalName: '', principalNip: '', level: 'SD', grade: '',
        semester: 'I / Ganjil', subject: '', cp: '', tp: '',
        meetings: 1, duration: '', pedagogy: [], dimensi: []
      });
    }
  };

  const handleLoadPreviousDocument = () => {
    if (savedData) {
      setFormData(savedData);
      if (onViewPrevious) {
        onViewPrevious();
      } else {
        onSubmit(savedData);
      }
    }
  };
  
  const isSchoolAllowed = ALLOWED_SCHOOLS.some(
    school => school.toUpperCase().trim() === formData.schoolName.toUpperCase().trim()
  );

  const isTeacherAllowed = ALLOWED_TEACHERS.some(
    teacher => teacher.toUpperCase().trim() === formData.teacherName.toUpperCase().trim()
  );
  
  const isAccessAllowed = isSchoolAllowed && isTeacherAllowed;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Reset CP jika Kelas atau Jenjang atau Mapel berubah
    if (name === 'grade' || name === 'level' || name === 'subject') {
      setFormData(prev => ({ ...prev, [name]: value, cp: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDimensiToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      dimensi: prev.dimensi.includes(item)
        ? prev.dimensi.filter(i => i !== item)
        : [...prev.dimensi, item]
    }));
  };

  const handlePedagogyChange = (index: number, value: string) => {
    const newPedagogy = [...formData.pedagogy];
    newPedagogy[index] = value;
    setFormData(prev => ({ ...prev, pedagogy: newPedagogy }));
  };

  const updateMeetings = (val: number) => {
    const newCount = Math.max(1, formData.meetings + val);
    const newPedagogy = [...formData.pedagogy];
    if (val > 0) {
      newPedagogy.push('Inkuiri-Discovery');
    } else if (newCount < formData.meetings) {
      newPedagogy.pop();
    }
    setFormData(prev => ({ ...prev, meetings: newCount, pedagogy: newPedagogy }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAccessAllowed) {
      alert(`Maaf, kombinasi Satuan Pendidikan dan Nama Guru belum terdaftar dalam sistem.`);
      return;
    }
    onSubmit(formData);
  };

  const sectionClass = "glass p-6 md:p-8 rounded-[1.5rem] space-y-6";
  const labelClass = "text-sm font-bold text-blue-800 flex items-center gap-2";
  const inputClass = "w-full bg-white/50 border border-blue-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";

  const showWarning = (formData.schoolName || formData.teacherName) && !isAccessAllowed;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Tombol Aksi di Bagian Atas */}
      <div className="flex justify-end gap-3 px-2">
        {savedData && (
          <button
            type="button"
            onClick={handleLoadPreviousDocument}
            className="flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-all shadow-sm border border-blue-100"
          >
            <FileText className="w-3.5 h-3.5" /> Lihat Hasil Sebelumnya
          </button>
        )}
        <button
          type="button"
          onClick={handleClearForm}
          className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all shadow-sm border border-red-100"
        >
          <Trash2 className="w-3.5 h-3.5" /> Bersihkan Draf Form
        </button>
      </div>

      {/* Identitas Satuan Pendidikan */}
      <div className={sectionClass}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <School className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-blue-900">Identitas Satuan Pendidikan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}><School className="w-4 h-4"/> Nama Satuan Pendidikan</label>
            <input name="schoolName" value={formData.schoolName} onChange={handleChange} required className={inputClass} placeholder="Contoh: SD Negeri 1 Merdeka" />
          </div>
          <div className="space-y-2">
            <label className={labelClass}><UserIcon className="w-4 h-4"/> Nama Guru</label>
            <input name="teacherName" value={formData.teacherName} onChange={handleChange} required className={inputClass} placeholder="Nama Lengkap" />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>NIP Guru</label>
            <input name="teacherNip" value={formData.teacherNip} onChange={handleChange} required className={inputClass} placeholder="NIP" />
          </div>
          <div className="space-y-2">
            <label className={labelClass}><Briefcase className="w-4 h-4"/> Jabatan</label>
            <select name="position" value={formData.position} onChange={handleChange} className={inputClass}>
              <option value="Guru Kelas">Guru Kelas</option>
              <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
              <option value="Wali Kelas">Wali Kelas</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}><UserIcon className="w-4 h-4"/> Nama Kepala Sekolah</label>
            <input name="principalName" value={formData.principalName} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>NIP Kepala Sekolah</label>
            <input name="principalNip" value={formData.principalNip} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
      </div>

      {/* Informasi Pembelajaran */}
      <div className={sectionClass}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-blue-900">Informasi Pembelajaran</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>Jenjang Pendidikan</label>
            <select name="level" value={formData.level} onChange={handleChange} className={inputClass}>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option> {/* Opsi SMK Ditambahkan */}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Kelas</label>
            <input name="grade" value={formData.grade} onChange={handleChange} className={inputClass} placeholder="Contoh: 1, 7, 10" required />
          </div>
          <div className="space-y-2">
            <label className={labelClass}><Calendar className="w-4 h-4"/> Semester</label>
            <select name="semester" value={formData.semester} onChange={handleChange} className={inputClass}>
              <option value="I / Ganjil">I / Ganjil</option>
              <option value="II / Genap">II / Genap</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className={labelClass}><BookOpen className="w-4 h-4"/> Mata Pelajaran (Mapel)</label>
          <input name="subject" value={formData.subject} onChange={handleChange} className={inputClass} placeholder="Contoh: Pendidikan Pancasila" required />
        </div>

        {/* INPUT CP YANG SUDAH MENJADI DROPDOWN */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={labelClass}><Layers className="w-4 h-4"/> Capaian Pembelajaran (CP)</label>
            {currentFase && (
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                Fase {currentFase}
              </span>
            )}
          </div>
          <select 
            name="cp" 
            value={formData.cp} 
            onChange={handleChange} 
            className={inputClass} 
            required
            disabled={!formData.grade || availableCPs.length === 0}
          >
            <option value="" disabled>
              {!formData.grade 
                ? "-- Isi Kelas terlebih dahulu --" 
                : availableCPs.length === 0 
                  ? "-- CP belum tersedia untuk Mapel ini --" 
                  : "-- Pilih Capaian Pembelajaran --"}
            </option>
            {availableCPs.map((cp, idx) => (
              <option key={idx} value={`[Elemen: ${cp.elemen}] ${cp.text}`}>
                [{cp.elemen}] {cp.text.length > 80 ? `${cp.text.substring(0, 80)}...` : cp.text}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Tujuan Pembelajaran (TP)</label>
          <textarea name="tp" value={formData.tp} onChange={handleChange} className={cn(inputClass, "h-24 resize-none")} required />
        </div>
      </div>

      {/* Metode & Durasi */}
      <div className={sectionClass}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-blue-900">Metode & Durasi</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className={labelClass}>Jumlah Pertemuan</label>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => updateMeetings(-1)} 
                className="w-12 h-12 rounded-xl border-2 border-blue-200 flex items-center justify-center hover:bg-blue-50 transition-colors"
              >
                <Minus className="w-5 h-5 text-blue-600"/>
              </button>

              <input
                type="number"
                name="meetings"
                value={formData.meetings}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value) || 1);
                  const diff = val - formData.meetings;
                  updateMeetings(diff);
                }}
                className="w-20 h-12 text-center text-xl font-bold bg-white/50 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                min="1"
              />

              <button 
                type="button" 
                onClick={() => updateMeetings(1)} 
                className="w-12 h-12 rounded-xl border-2 border-blue-200 flex items-center justify-center hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600"/>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <label className={labelClass}><Clock className="w-4 h-4"/> Durasi Per Pertemuan</label>
            <input name="duration" value={formData.duration} onChange={handleChange} className={inputClass} placeholder="Contoh: 2 x 35 menit" required />
          </div>
        </div>

        <div className="space-y-4">
          <label className={labelClass}>Praktik Pedagogis Per Pertemuan</label>
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: formData.meetings }).map((_, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 bg-white/30 p-4 rounded-xl border border-blue-100">
                <span className="text-sm font-bold text-teal-700 shrink-0">Pertemuan {idx + 1}:</span>
                <div className="flex flex-wrap gap-2">
                  {PEDAGOGY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handlePedagogyChange(idx, opt)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                        formData.pedagogy[idx] === opt 
                          ? "bg-teal-600 border-teal-600 text-white shadow-sm shadow-teal-600/30" 
                          : "bg-white border-blue-200 text-blue-700 hover:border-blue-400"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dimensi Lulusan */}
      <div className={sectionClass}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-blue-900">Dimensi Lulusan</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {DIMENSI_LULUSAN.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => handleDimensiToggle(item)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                formData.dimensi.includes(item)
                  ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white border-blue-200 text-blue-700 hover:border-blue-400"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        {formData.dimensi.length === 0 && (
          <p className="text-xs text-amber-600 italic font-medium">Pilih minimal satu dimensi lulusan.</p>
        )}
      </div>

      {/* PERINGATAN VISUAL */}
      {showWarning && (
        <div className="mx-4 p-4 bg-orange-50 border border-orange-200 rounded-xl animate-pulse">
          <p className="text-sm text-orange-700 font-medium">
            ⚠️ Lisensi Anda Tidak Terdaftar, Hubungi Developer TM Generator APP (Fidhal Touna AI).
          </p>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <motion.button
        whileHover={!isLoading && formData.dimensi.length > 0 && isAccessAllowed ? { scale: 1.01 } : {}}
        whileTap={!isLoading && formData.dimensi.length > 0 && isAccessAllowed ? { scale: 0.99 } : {}}
        type="submit"
        disabled={isLoading || formData.dimensi.length === 0 || !isAccessAllowed}
        className={cn(
          "w-full bg-gradient-to-r from-blue-700 to-teal-600 text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all",
          (isLoading || formData.dimensi.length === 0 || !isAccessAllowed) 
            ? "opacity-40 cursor-not-allowed grayscale" 
            : "opacity-100 shadow-blue-500/20"
        )}
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating Modul Ajar...
          </>
        ) : (
          <>
            <Send className="w-6 h-6" />
            Generate RPPM
          </>
        )}
      </motion.button>
    </form>
  );
}
