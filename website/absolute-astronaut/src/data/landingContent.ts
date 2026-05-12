import type { Product } from "./products";
import type { CityId } from "../utils/seo";

export type Lang = "en" | "id";

export interface LandingPageContent {
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  productsHeading: string;
  productFamilies?: Array<Product["family"]>;
  productIds?: string[];
  industriesHeading: string;
  industries: { title: string; body: string }[];
  trustHeading: string;
  trustBody: string;
  coverageHeading?: string | null;
  coverageBody?: string | null;
  faqHeading: string;
  faqs: { q: string; a: string }[];
  crossLinksHeading?: string | null;
  crossLinkSlugs?: string[];
  ctaHeading: string;
  ctaBody: string;
  ctaButtonLabel: string;
}

export type LandingSlug =
  | "alternator-indonesia"
  | "motor-listrik-indonesia"
  | "generator-indonesia"
  | "genset-indonesia"
  | "genset-medan"
  | "genset-jakarta"
  | "genset-surabaya";

export const cityForSlug: Record<LandingSlug, CityId | null> = {
  "alternator-indonesia": null,
  "motor-listrik-indonesia": null,
  "generator-indonesia": null,
  "genset-indonesia": null,
  "genset-medan": "medan",
  "genset-jakarta": "jakarta",
  "genset-surabaya": "surabaya",
};

export const allLandingSlugs: LandingSlug[] = [
  "alternator-indonesia",
  "motor-listrik-indonesia",
  "generator-indonesia",
  "genset-indonesia",
  "genset-medan",
  "genset-jakarta",
  "genset-surabaya",
];

export const countryWideSlugs: LandingSlug[] = [
  "alternator-indonesia",
  "motor-listrik-indonesia",
  "generator-indonesia",
  "genset-indonesia",
];
export const citySlugs: LandingSlug[] = [
  "genset-medan",
  "genset-jakarta",
  "genset-surabaya",
];

const trustBodyEn =
  "Indah Machine has supplied alternators, electric motors, and power presses to Indonesian industry for over 50 years. We support sizing, installation, commissioning, and after-sales — backed by stock in Medan with shipping to Jakarta, Surabaya, and across Indonesia.";
const trustBodyId =
  "Indah Machine telah memasok alternator, motor listrik, dan power press untuk industri Indonesia selama lebih dari 50 tahun. Kami mendukung pemilihan kapasitas, instalasi, commissioning, dan layanan purna jual — dengan stok di Medan dan pengiriman ke Jakarta, Surabaya, dan seluruh Indonesia.";

const trustHeadingEn = "Why genset builders and integrators choose Indah Machine";
const trustHeadingId = "Mengapa pembuat genset dan integrator memilih Indah Machine";

export const landingContent: Record<LandingSlug, Record<Lang, LandingPageContent>> = {
  // ====================== Alternator Indonesia ======================
  "alternator-indonesia": {
    en: {
      title: "Alternator Indonesia | Generator Alternator Supplier — Indah Machine",
      description:
        "Alternator supplier Indonesia — UCW, TZH, T2W3, Mecc Alte brushless synchronous alternators for generator and genset projects. Stock in Medan; serving Jakarta and Surabaya.",
      eyebrow: "Indonesia",
      h1: "Alternator Indonesia — Brushless Synchronous Alternators for Generator & Genset",
      intro:
        "Looking for an alternator generator supplier in Indonesia? Indah Machine distributes brushless synchronous alternators across the UCW, TZH, TZH-N, T2W3, T2W3-N, Mecc Alte, and brushless series — sized from small standby units to large prime-power genset heads. Based in Medan with warehouse coverage in Jakarta and Surabaya, we ship nationwide and provide sizing, installation, and commissioning support.",
      productsHeading: "Alternator series we supply",
      productFamilies: ["Alternator"],
      industriesHeading: "Where these alternators are used",
      industries: [
        { title: "Palm oil mills", body: "Prime-power gensets for crude palm oil and palm kernel processing across Sumatra and Kalimantan." },
        { title: "Manufacturing standby", body: "Backup power for production lines and cold storage in Java industrial estates." },
        { title: "Marine and offshore", body: "Land-use and marine-specification alternators for vessel and offshore platform builders." },
        { title: "Telecom and commercial", body: "Reliable standby alternators for data centers, telecom towers, and commercial buildings." },
      ],
      trustHeading: trustHeadingEn,
      trustBody: trustBodyEn,
      faqHeading: "Frequently asked questions about alternators",
      faqs: [
        {
          q: "Which alternator series should I choose for a diesel genset?",
          a: "For most prime-power genset builds, the UCW or TZH brushless synchronous series cover the typical 50 kVA – 1500 kVA range. For specific marine or land-use compliance, the TZH-N or T2W3-N series are appropriate. We can recommend the right series once you share kVA, voltage, frequency, and engine RPM.",
        },
        {
          q: "Do you supply Stamford-equivalent alternators?",
          a: "Yes. Our brushless synchronous alternators are direct functional equivalents to Stamford-class units, with comparable performance characteristics and at competitive cost. Contact us with your spec sheet for a like-for-like quote.",
        },
        {
          q: "Can you ship alternators to Jakarta and Surabaya?",
          a: "Yes. We hold stock in Medan and route shipments through our Jakarta and Surabaya coverage. Lead time depends on size and current stock — please contact us for delivery estimates.",
        },
        {
          q: "Do you provide installation and commissioning?",
          a: "Yes. Indah Machine offers installation, commissioning, and technical advisory for all alternator products we supply. This is included in our scope of work for major projects.",
        },
        {
          q: "How do I get a price quote?",
          a: "Pricing is contact-for-quote. Send us your kVA, voltage, frequency, and project context via the contact form or WhatsApp and we will respond with a detailed quotation.",
        },
      ],
      crossLinksHeading: "Looking for alternators in a specific city?",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Ready to spec your alternator?",
      ctaBody: "Send us your kVA, voltage, and frequency. We will recommend the right series and prepare a quotation.",
      ctaButtonLabel: "Contact for Quote",
    },
    id: {
      title: "Alternator Indonesia | Supplier Alternator Generator — Indah Machine",
      description:
        "Supplier alternator Indonesia — alternator brushless sinkron seri UCW, TZH, T2W3, Mecc Alte untuk proyek generator dan genset. Stok di Medan; melayani Jakarta dan Surabaya.",
      eyebrow: "Indonesia",
      h1: "Alternator Indonesia — Alternator Brushless Sinkron untuk Generator & Genset",
      intro:
        "Mencari supplier alternator generator di Indonesia? Indah Machine mendistribusikan alternator brushless sinkron seri UCW, TZH, TZH-N, T2W3, T2W3-N, Mecc Alte, dan brushless — dari unit standby kecil hingga kepala genset prime-power besar. Berbasis di Medan dengan cakupan gudang di Jakarta dan Surabaya, kami mengirim ke seluruh Indonesia dan memberikan dukungan pemilihan kapasitas, instalasi, serta commissioning.",
      productsHeading: "Seri alternator yang kami pasok",
      productFamilies: ["Alternator"],
      industriesHeading: "Di mana alternator ini digunakan",
      industries: [
        { title: "Pabrik kelapa sawit", body: "Genset prime-power untuk pengolahan CPO dan inti sawit di Sumatera dan Kalimantan." },
        { title: "Standby manufaktur", body: "Daya cadangan untuk lini produksi dan cold storage di kawasan industri Jawa." },
        { title: "Marine dan offshore", body: "Alternator land-use dan spesifikasi marine untuk pembuat kapal dan platform lepas pantai." },
        { title: "Telekomunikasi dan komersial", body: "Alternator standby andal untuk data center, menara telekomunikasi, dan gedung komersial." },
      ],
      trustHeading: trustHeadingId,
      trustBody: trustBodyId,
      faqHeading: "Pertanyaan umum tentang alternator",
      faqs: [
        {
          q: "Seri alternator mana yang cocok untuk genset diesel?",
          a: "Untuk sebagian besar pembuatan genset prime-power, seri brushless sinkron UCW atau TZH mencakup rentang umum 50 kVA – 1500 kVA. Untuk kepatuhan marine atau land-use khusus, seri TZH-N atau T2W3-N lebih sesuai. Kami dapat merekomendasikan seri yang tepat setelah Anda memberikan kVA, tegangan, frekuensi, dan RPM mesin.",
        },
        {
          q: "Apakah Anda menyuplai alternator setara Stamford?",
          a: "Ya. Alternator brushless sinkron kami adalah ekuivalen fungsional langsung untuk unit kelas Stamford, dengan karakteristik performa yang sebanding dan biaya yang kompetitif. Hubungi kami dengan spesifikasi Anda untuk penawaran setara.",
        },
        {
          q: "Apakah Anda mengirim alternator ke Jakarta dan Surabaya?",
          a: "Ya. Kami menyimpan stok di Medan dan mengirimkan melalui cakupan Jakarta dan Surabaya kami. Lead time tergantung ukuran dan stok saat ini — silakan hubungi kami untuk perkiraan pengiriman.",
        },
        {
          q: "Apakah Anda menyediakan instalasi dan commissioning?",
          a: "Ya. Indah Machine menyediakan instalasi, commissioning, dan konsultasi teknis untuk semua alternator yang kami pasok. Ini termasuk dalam lingkup kerja kami untuk proyek besar.",
        },
        {
          q: "Bagaimana cara mendapatkan penawaran harga?",
          a: "Harga melalui penawaran. Kirimkan kVA, tegangan, frekuensi, dan konteks proyek Anda melalui formulir kontak atau WhatsApp dan kami akan menanggapi dengan penawaran lengkap.",
        },
      ],
      crossLinksHeading: "Mencari alternator di kota tertentu?",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Siap menentukan spesifikasi alternator?",
      ctaBody: "Kirimkan kVA, tegangan, dan frekuensi. Kami akan merekomendasikan seri yang tepat dan menyiapkan penawaran.",
      ctaButtonLabel: "Minta Penawaran",
    },
  },

  // ====================== Motor Listrik Indonesia ======================
  "motor-listrik-indonesia": {
    en: {
      title: "Electric Motor Distributor Indonesia | Motor Listrik — Indah Machine",
      description:
        "Electric motor distributor Indonesia — MECC Y2/Y23, YJS, Y/YR, YPTZ/YPTQ three-phase motors for pumps, fans, compressors, and production lines. Stock in Medan; Jakarta and Surabaya coverage.",
      eyebrow: "Indonesia",
      h1: "Electric Motor Distributor Indonesia — Motor Listrik for Industry",
      intro:
        "Indah Machine is an electric motor distributor for Indonesian industry. We supply three-phase asynchronous motors across the MECC Y2/Y23, YJS compact, Y/YR slip-ring, and YPTZ/YPTQ series — for pumps, fans, compressors, conveyors, and production lines. Stock in Medan, with Jakarta and Surabaya warehouse coverage and nationwide shipping.",
      productsHeading: "Motor series we distribute",
      productFamilies: ["Electric Motor"],
      industriesHeading: "Common applications",
      industries: [
        { title: "Pumps and water systems", body: "Continuous-duty motors for irrigation, water supply, and wastewater treatment." },
        { title: "Fans and blowers", body: "TEFC motors for industrial ventilation, dust collection, and HVAC." },
        { title: "Compressors", body: "Heavy-duty motors for screw and reciprocating compressors." },
        { title: "Production lines", body: "Conveyors, mixers, mills, and process equipment across food and manufacturing." },
      ],
      trustHeading: "Why factories choose Indah Machine for motor listrik",
      trustBody: trustBodyEn,
      faqHeading: "Frequently asked questions about electric motors",
      faqs: [
        {
          q: "Which motor series do you recommend for a continuous-duty pump?",
          a: "The MECC Y2/Y23 series is our most common recommendation for continuous-duty pump applications, with TEFC enclosure and Class F insulation. For specific torque or starting profiles, we may recommend the Y/YR slip-ring or YPTZ/YPTQ series.",
        },
        {
          q: "Do you supply IE3 or high-efficiency motors?",
          a: "Yes — please contact us with your kW, RPM, voltage, and efficiency class requirement and we will quote suitable models.",
        },
        {
          q: "Is Y/YR available with a printed catalog?",
          a: "The Y/YR series catalog is available on request. Please contact us via WhatsApp or the contact form and we will share full dimensions and ratings.",
        },
        {
          q: "Do you ship to Jakarta and Surabaya?",
          a: "Yes. We dispatch from Medan and have warehouse coverage in Jakarta and Surabaya for faster delivery to Java-based customers.",
        },
        {
          q: "Can you assist with motor sizing?",
          a: "Yes. Share the load type, kW, RPM, and operating environment, and we will recommend the right series and frame size.",
        },
      ],
      crossLinksHeading: "Looking for motors in a specific city?",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Need a motor quote?",
      ctaBody: "Tell us the kW, RPM, voltage, and application. We will recommend a suitable motor and prepare a quote.",
      ctaButtonLabel: "Contact for Quote",
    },
    id: {
      title: "Distributor Motor Listrik Indonesia | Elektrik Motor — Indah Machine",
      description:
        "Distributor motor listrik Indonesia — motor 3-fasa MECC Y2/Y23, YJS, Y/YR, YPTZ/YPTQ untuk pompa, fan, kompresor, dan lini produksi. Stok di Medan; cakupan Jakarta dan Surabaya.",
      eyebrow: "Indonesia",
      h1: "Distributor Motor Listrik Indonesia — Elektrik Motor untuk Industri",
      intro:
        "Indah Machine adalah distributor motor listrik untuk industri Indonesia. Kami memasok motor asinkron 3-fasa seri MECC Y2/Y23, YJS kompak, Y/YR slip-ring, dan YPTZ/YPTQ — untuk pompa, fan, kompresor, konveyor, dan lini produksi. Stok di Medan, dengan cakupan gudang di Jakarta dan Surabaya serta pengiriman ke seluruh Indonesia.",
      productsHeading: "Seri motor yang kami distribusikan",
      productFamilies: ["Electric Motor"],
      industriesHeading: "Aplikasi umum",
      industries: [
        { title: "Pompa dan sistem air", body: "Motor continuous-duty untuk irigasi, suplai air, dan pengolahan air limbah." },
        { title: "Fan dan blower", body: "Motor TEFC untuk ventilasi industri, dust collector, dan HVAC." },
        { title: "Kompresor", body: "Motor heavy-duty untuk kompresor screw dan reciprocating." },
        { title: "Lini produksi", body: "Konveyor, mixer, mill, dan peralatan proses di sektor makanan dan manufaktur." },
      ],
      trustHeading: "Mengapa pabrik memilih Indah Machine untuk motor listrik",
      trustBody: trustBodyId,
      faqHeading: "Pertanyaan umum tentang motor listrik",
      faqs: [
        {
          q: "Seri motor mana yang direkomendasikan untuk pompa continuous-duty?",
          a: "Seri MECC Y2/Y23 adalah rekomendasi paling umum untuk aplikasi pompa continuous-duty, dengan enclosure TEFC dan isolasi Kelas F. Untuk profil torsi atau starting tertentu, kami dapat merekomendasikan seri Y/YR slip-ring atau YPTZ/YPTQ.",
        },
        {
          q: "Apakah Anda menyuplai motor IE3 atau efisiensi tinggi?",
          a: "Ya — silakan hubungi kami dengan kebutuhan kW, RPM, tegangan, dan kelas efisiensi Anda, kami akan menawarkan model yang sesuai.",
        },
        {
          q: "Apakah Y/YR tersedia dengan katalog cetak?",
          a: "Katalog seri Y/YR tersedia berdasarkan permintaan. Silakan hubungi kami melalui WhatsApp atau formulir kontak, kami akan membagikan dimensi dan rating lengkap.",
        },
        {
          q: "Apakah Anda mengirim ke Jakarta dan Surabaya?",
          a: "Ya. Kami mengirim dari Medan dan memiliki cakupan gudang di Jakarta dan Surabaya untuk pengiriman lebih cepat ke pelanggan di Jawa.",
        },
        {
          q: "Apakah Anda membantu pemilihan motor?",
          a: "Ya. Berikan jenis beban, kW, RPM, dan lingkungan operasi, kami akan merekomendasikan seri dan ukuran frame yang tepat.",
        },
      ],
      crossLinksHeading: "Mencari motor di kota tertentu?",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Butuh penawaran motor?",
      ctaBody: "Beritahu kami kW, RPM, tegangan, dan aplikasi. Kami akan merekomendasikan motor dan menyiapkan penawaran.",
      ctaButtonLabel: "Minta Penawaran",
    },
  },

  // ====================== Generator Indonesia ======================
  "generator-indonesia": {
    en: {
      title: "Generator Indonesia | Components for Genset Builders — Indah Machine",
      description:
        "Generator components for Indonesian genset builders and integrators — alternator heads, bearings, controls, and electric motors. Indah Machine, Medan; Jakarta and Surabaya coverage.",
      eyebrow: "Indonesia",
      h1: "Generator Indonesia — Components & Alternators for Genset Builders",
      intro:
        "Indah Machine supplies <strong>generator components</strong> to genset builders, integrators, and maintenance shops in Indonesia. We do not assemble complete diesel gensets — instead, we provide the alternator heads (UCW, TZH, T2W3, Mecc Alte) and electrical components that go into your genset build. Based in Medan with warehouse coverage in Jakarta and Surabaya.",
      productsHeading: "Alternator heads for your generator builds",
      productFamilies: ["Alternator"],
      industriesHeading: "Who buys generator components from us",
      industries: [
        { title: "Genset assemblers", body: "OEMs and assemblers building diesel gensets for the Indonesian market." },
        { title: "Maintenance shops", body: "Workshops re-winding, refurbishing, or replacing alternator heads on existing gensets." },
        { title: "EPC contractors", body: "Project contractors specifying alternator components for industrial power packages." },
        { title: "Marine and offshore builders", body: "Vessel and platform builders sourcing land-use and marine-spec alternators." },
      ],
      trustHeading: trustHeadingEn,
      trustBody: trustBodyEn,
      faqHeading: "FAQ for generator builders",
      faqs: [
        {
          q: "Do you sell complete diesel gensets?",
          a: "No. Indah Machine focuses on the alternator head and components side of the build. We supply alternators, electric motors, and power presses — not the diesel engine or full genset enclosure.",
        },
        {
          q: "Which alternator series matches a typical 100 kVA prime-power genset?",
          a: "The UCW-100-1500 or equivalent TZH-100 brushless synchronous alternator is the typical match for a 100 kVA prime-power 1500 RPM genset at 400/230V 50 Hz. We can confirm based on your engine spec.",
        },
        {
          q: "Can I order multiple alternators for a project?",
          a: "Yes. Project quantities are welcome — share the project schedule and we can plan stock and delivery from Medan, Jakarta, or Surabaya.",
        },
        {
          q: "Do you provide technical drawings?",
          a: "Yes. Each series has a technical PDF catalog (downloadable on the product detail page) and we can provide additional drawings on request.",
        },
        {
          q: "What about generator parts other than alternators?",
          a: "Contact us with the parts list and we will advise what we stock or can source.",
        },
      ],
      crossLinksHeading: "Generators by city",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Building a genset?",
      ctaBody: "Tell us the engine spec and target output. We will recommend matching alternator and components.",
      ctaButtonLabel: "Contact for Quote",
    },
    id: {
      title: "Generator Indonesia | Komponen untuk Pembuat Genset — Indah Machine",
      description:
        "Komponen generator untuk pembuat genset dan integrator di Indonesia — kepala alternator, bearing, kontrol, dan motor listrik. Indah Machine, Medan; cakupan Jakarta dan Surabaya.",
      eyebrow: "Indonesia",
      h1: "Generator Indonesia — Komponen & Alternator untuk Pembuat Genset",
      intro:
        "Indah Machine memasok <strong>komponen generator</strong> untuk pembuat genset, integrator, dan bengkel servis di Indonesia. Kami tidak merakit genset diesel lengkap — sebaliknya, kami menyediakan kepala alternator (UCW, TZH, T2W3, Mecc Alte) dan komponen elektrik yang masuk ke dalam pembuatan genset Anda. Berbasis di Medan dengan cakupan gudang di Jakarta dan Surabaya.",
      productsHeading: "Kepala alternator untuk pembuatan generator Anda",
      productFamilies: ["Alternator"],
      industriesHeading: "Siapa yang membeli komponen generator dari kami",
      industries: [
        { title: "Perakit genset", body: "OEM dan perakit yang membangun genset diesel untuk pasar Indonesia." },
        { title: "Bengkel servis", body: "Workshop yang melakukan rewinding, refurbishment, atau penggantian kepala alternator pada genset existing." },
        { title: "Kontraktor EPC", body: "Kontraktor proyek yang menentukan komponen alternator untuk paket daya industri." },
        { title: "Pembuat marine dan offshore", body: "Pembuat kapal dan platform yang mencari alternator land-use dan spesifikasi marine." },
      ],
      trustHeading: trustHeadingId,
      trustBody: trustBodyId,
      faqHeading: "FAQ untuk pembuat generator",
      faqs: [
        {
          q: "Apakah Anda menjual genset diesel lengkap?",
          a: "Tidak. Indah Machine fokus pada sisi kepala alternator dan komponen. Kami menyuplai alternator, motor listrik, dan power press — bukan mesin diesel atau enclosure genset lengkap.",
        },
        {
          q: "Seri alternator mana yang cocok untuk genset prime-power 100 kVA?",
          a: "Alternator brushless sinkron UCW-100-1500 atau ekuivalen TZH-100 adalah pasangan tipikal untuk genset 100 kVA prime-power 1500 RPM pada 400/230V 50 Hz. Kami dapat mengonfirmasi berdasarkan spesifikasi mesin Anda.",
        },
        {
          q: "Apakah saya dapat memesan beberapa alternator untuk satu proyek?",
          a: "Ya. Kuantitas proyek dipersilakan — beritahu kami jadwal proyek, kami dapat merencanakan stok dan pengiriman dari Medan, Jakarta, atau Surabaya.",
        },
        {
          q: "Apakah Anda menyediakan gambar teknis?",
          a: "Ya. Setiap seri memiliki katalog teknis PDF (dapat diunduh di halaman detail produk) dan kami dapat menyediakan gambar tambahan atas permintaan.",
        },
        {
          q: "Bagaimana dengan suku cadang generator selain alternator?",
          a: "Hubungi kami dengan daftar parts dan kami akan menyarankan apa yang kami stok atau dapat sourcing.",
        },
      ],
      crossLinksHeading: "Generator per kota",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Membangun genset?",
      ctaBody: "Beritahu kami spesifikasi mesin dan output target. Kami akan merekomendasikan alternator dan komponen yang sesuai.",
      ctaButtonLabel: "Minta Penawaran",
    },
  },

  // ====================== Genset Indonesia ======================
  "genset-indonesia": {
    en: {
      title: "Genset Indonesia | Alternator Genset Supplier — Indah Machine",
      description:
        "Genset alternator supplier Indonesia — brushless synchronous alternators for diesel genset builds. UCW, TZH, Mecc Alte. Indah Machine, Medan; Jakarta and Surabaya coverage.",
      eyebrow: "Indonesia",
      h1: "Genset Indonesia — Alternator Heads for Genset Projects",
      intro:
        "Building or maintaining a diesel <strong>genset</strong> in Indonesia? Indah Machine supplies the alternator head and electrical components that go into your build — UCW, TZH, T2W3, and Mecc Alte brushless synchronous series, sized from small standby to large prime-power applications. We are not a complete-genset reseller; our role is to be your reliable alternator and components partner.",
      productsHeading: "Alternator heads for genset builds",
      productFamilies: ["Alternator"],
      industriesHeading: "Genset use cases we serve",
      industries: [
        { title: "Palm oil mill genset", body: "Prime-power genset alternators for crude palm oil and palm kernel mills across Sumatra and Kalimantan." },
        { title: "Marine and vessel genset", body: "Marine-specification and land-use alternators for vessel and platform genset packages." },
        { title: "Telecom backup genset", body: "Standby alternators for telecom tower and base-station genset cabinets." },
        { title: "Commercial and data center", body: "Reliable standby alternators for office buildings, hospitals, and data center backup gensets." },
      ],
      trustHeading: trustHeadingEn,
      trustBody: trustBodyEn,
      faqHeading: "Genset FAQ",
      faqs: [
        {
          q: "Do you sell complete gensets with engines?",
          a: "No — we supply the alternator head and electrical components only. We work with genset assemblers and integrators across Indonesia who pair our alternators with their preferred engine.",
        },
        {
          q: "What kVA range do you cover?",
          a: "Our alternators cover roughly 12 kVA – 1500 kVA across the UCW, TZH, T2W3, and Mecc Alte series. Larger units may be available on request.",
        },
        {
          q: "Are your alternators suitable for 50 Hz operation?",
          a: "Yes. All listed series are available in 50 Hz / 400-230V configurations standard for Indonesian projects.",
        },
        {
          q: "Do you supply alternators for marine genset?",
          a: "Yes — the TZH-N and T2W3-N series include marine-specification options. Share your compliance requirement and we will confirm.",
        },
        {
          q: "Do you have stock in Jakarta and Surabaya?",
          a: "Yes, our Jakarta and Surabaya warehouses hold rotating stock. Lead time depends on series and capacity.",
        },
      ],
      crossLinksHeading: "Genset by city",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Specify your genset alternator",
      ctaBody: "Send us the genset kVA, voltage, frequency, and engine RPM. We will quote a matching alternator.",
      ctaButtonLabel: "Contact for Quote",
    },
    id: {
      title: "Genset Indonesia | Supplier Alternator Genset — Indah Machine",
      description:
        "Supplier alternator genset Indonesia — alternator brushless sinkron untuk pembuatan genset diesel. UCW, TZH, Mecc Alte. Indah Machine, Medan; cakupan Jakarta dan Surabaya.",
      eyebrow: "Indonesia",
      h1: "Genset Indonesia — Kepala Alternator untuk Proyek Genset",
      intro:
        "Membangun atau merawat <strong>genset</strong> diesel di Indonesia? Indah Machine memasok kepala alternator dan komponen elektrik yang masuk ke dalam pembuatan Anda — seri brushless sinkron UCW, TZH, T2W3, dan Mecc Alte, dari aplikasi standby kecil hingga prime-power besar. Kami bukan reseller genset lengkap; peran kami adalah menjadi mitra alternator dan komponen yang andal.",
      productsHeading: "Kepala alternator untuk pembuatan genset",
      productFamilies: ["Alternator"],
      industriesHeading: "Use case genset yang kami layani",
      industries: [
        { title: "Genset pabrik kelapa sawit", body: "Alternator genset prime-power untuk pabrik CPO dan inti sawit di Sumatera dan Kalimantan." },
        { title: "Genset marine dan kapal", body: "Alternator spesifikasi marine dan land-use untuk paket genset kapal dan platform." },
        { title: "Genset backup telekomunikasi", body: "Alternator standby untuk kabinet genset tower dan BTS telekomunikasi." },
        { title: "Komersial dan data center", body: "Alternator standby andal untuk gedung kantor, rumah sakit, dan genset backup data center." },
      ],
      trustHeading: trustHeadingId,
      trustBody: trustBodyId,
      faqHeading: "FAQ Genset",
      faqs: [
        {
          q: "Apakah Anda menjual genset lengkap dengan mesin?",
          a: "Tidak — kami hanya menyuplai kepala alternator dan komponen elektrik. Kami bekerja sama dengan perakit genset dan integrator di seluruh Indonesia yang memasangkan alternator kami dengan mesin pilihan mereka.",
        },
        {
          q: "Berapa rentang kVA yang Anda cakup?",
          a: "Alternator kami mencakup sekitar 12 kVA – 1500 kVA pada seri UCW, TZH, T2W3, dan Mecc Alte. Unit yang lebih besar dapat tersedia atas permintaan.",
        },
        {
          q: "Apakah alternator Anda cocok untuk operasi 50 Hz?",
          a: "Ya. Semua seri tersedia dalam konfigurasi 50 Hz / 400-230V yang standar untuk proyek di Indonesia.",
        },
        {
          q: "Apakah Anda menyuplai alternator untuk genset marine?",
          a: "Ya — seri TZH-N dan T2W3-N memiliki opsi spesifikasi marine. Bagikan kebutuhan kepatuhan Anda dan kami akan mengonfirmasi.",
        },
        {
          q: "Apakah Anda memiliki stok di Jakarta dan Surabaya?",
          a: "Ya, gudang Jakarta dan Surabaya kami memiliki rotating stock. Lead time tergantung seri dan kapasitas.",
        },
      ],
      crossLinksHeading: "Genset per kota",
      crossLinkSlugs: ["genset-medan", "genset-jakarta", "genset-surabaya"],
      ctaHeading: "Tentukan alternator genset Anda",
      ctaBody: "Kirimkan kVA genset, tegangan, frekuensi, dan RPM mesin. Kami akan menawarkan alternator yang sesuai.",
      ctaButtonLabel: "Minta Penawaran",
    },
  },

  // ====================== Genset Medan ======================
  "genset-medan": {
    en: cityPageEn(
      "Medan",
      "We are headquartered at Jln. Mangkubumi No. 12, Medan 20151, North Sumatra. From here we serve genset builders, palm oil mills, and industrial customers across Sumatra and beyond.",
      "Palm oil mills, plantations, and industrial estates across North Sumatra, Aceh, and Riau."
    ),
    id: cityPageId(
      "Medan",
      "Kami berkantor pusat di Jln. Mangkubumi No. 12, Medan 20151, Sumatera Utara. Dari sini kami melayani pembuat genset, pabrik kelapa sawit, dan pelanggan industri di seluruh Sumatera dan sekitarnya.",
      "Pabrik kelapa sawit, perkebunan, dan kawasan industri di seluruh Sumatera Utara, Aceh, dan Riau."
    ),
  },

  // ====================== Genset Jakarta ======================
  "genset-jakarta": {
    en: cityPageEn(
      "Jakarta",
      "Stock available from our Jakarta warehouse for faster delivery to Greater Jakarta and West Java. Technical support and engineering coordination is provided from our Medan headquarters.",
      "Commercial buildings, data centers, manufacturing in Bekasi/Cikarang, and telecom operators across Greater Jakarta."
    ),
    id: cityPageId(
      "Jakarta",
      "Stok tersedia dari gudang Jakarta kami untuk pengiriman lebih cepat ke Jabodetabek dan Jawa Barat. Dukungan teknis dan koordinasi engineering disediakan dari kantor pusat Medan.",
      "Gedung komersial, data center, manufaktur di Bekasi/Cikarang, dan operator telekomunikasi di Jabodetabek."
    ),
  },

  // ====================== Genset Surabaya ======================
  "genset-surabaya": {
    en: cityPageEn(
      "Surabaya",
      "Stock available from our Surabaya warehouse for faster delivery to East Java and Eastern Indonesia. Technical support and engineering coordination is provided from our Medan headquarters.",
      "Manufacturing, marine and vessel builders, and industrial estates across East Java and Eastern Indonesia."
    ),
    id: cityPageId(
      "Surabaya",
      "Stok tersedia dari gudang Surabaya kami untuk pengiriman lebih cepat ke Jawa Timur dan Indonesia Timur. Dukungan teknis dan koordinasi engineering disediakan dari kantor pusat Medan.",
      "Manufaktur, pembuat kapal dan marine, serta kawasan industri di Jawa Timur dan Indonesia Timur."
    ),
  },
};

// ---------- City page builders ----------

function cityPageEn(city: string, coverageBody: string, industriesContext: string): LandingPageContent {
  return {
    title: `Genset, Generator & Alternator ${city} | Indah Machine`,
    description: `Genset, generator, and alternator supplier in ${city}. Indah Machine — alternator heads, electric motors, and power presses for ${city} and surrounding industry. Contact for quote.`,
    eyebrow: `${city}, Indonesia`,
    h1: `Genset, Generator & Alternator Supplier in ${city}`,
    intro: `Indah Machine is a <strong>genset, generator, and alternator</strong> supplier in ${city}. We provide brushless synchronous alternator heads, electric motors, and components for genset builders, maintenance shops, and industrial buyers in ${city} and surrounding areas. ${coverageBody}`,
    productsHeading: `Alternator heads for genset projects in ${city}`,
    productFamilies: ["Alternator"],
    industriesHeading: `Industries we serve in ${city}`,
    industries: [
      { title: "Genset assemblers", body: `OEMs and assemblers building diesel gensets in ${city} and surrounding areas.` },
      { title: "Maintenance and refurbishment", body: `Workshops re-winding or replacing alternator heads on existing gensets.` },
      { title: "Industrial buyers", body: industriesContext },
      { title: "Project contractors", body: `EPC and integrators specifying alternator components for ${city} projects.` },
    ],
    trustHeading: `Why ${city} customers choose Indah Machine`,
    trustBody:
      `With over 50 years of experience and a presence in Medan, Jakarta, and Surabaya, Indah Machine combines deep technical expertise with reliable stock and shipping. We support sizing, installation, and commissioning for ${city} customers.`,
    coverageHeading: `${city} coverage and shipping`,
    coverageBody,
    faqHeading: `Frequently asked questions — ${city}`,
    faqs: [
      {
        q: `Do you have a physical office in ${city}?`,
        a: city === "Medan"
          ? `Yes — our headquarters is at Jln. Mangkubumi No. 12, Medan 20151. Visits are by appointment.`
          : `We operate a warehouse in ${city} for stock and dispatch. Sales, technical support, and engineering coordination are handled from our Medan headquarters. Contact us to arrange a meeting.`,
      },
      {
        q: `What lead time should I expect for delivery in ${city}?`,
        a: `Lead time depends on series, capacity, and current stock at our ${city} warehouse${city === "Medan" ? "" : " or Medan HQ"}. Please contact us with your spec for a delivery estimate.`,
      },
      {
        q: `Can I get a site visit or technical consultation in ${city}?`,
        a: `Yes. For larger projects we travel to ${city} for site visits and commissioning. Smaller consultations can be handled remotely via WhatsApp or video call.`,
      },
      {
        q: `Do you sell complete gensets in ${city}?`,
        a: `No — we supply the alternator head and electrical components, not complete diesel gensets. We work alongside genset assemblers in ${city} who source engines and assemble the full unit.`,
      },
      {
        q: `What is the best way to request a quote?`,
        a: `WhatsApp +62 853-4867-4326 or use the contact form on our website. Include your kVA / kW, voltage, frequency, and project location.`,
      },
    ],
    crossLinksHeading: "Other cities and product pages",
    crossLinkSlugs: [
      "alternator-indonesia",
      "motor-listrik-indonesia",
      "genset-indonesia",
      "generator-indonesia",
    ].concat(
      (["genset-medan", "genset-jakarta", "genset-surabaya"] as LandingSlug[]).filter(
        (s) => s !== `genset-${city.toLowerCase()}`
      )
    ),
    ctaHeading: `Talk to us about your ${city} project`,
    ctaBody: `Tell us the kVA, voltage, frequency, and project context. We will recommend the right alternator and prepare a quote with delivery to ${city}.`,
    ctaButtonLabel: "Contact for Quote",
  };
}

function cityPageId(city: string, coverageBody: string, industriesContext: string): LandingPageContent {
  return {
    title: `Genset, Generator & Alternator ${city} | Indah Machine`,
    description: `Supplier genset, generator, dan alternator di ${city}. Indah Machine — kepala alternator, motor listrik, dan power press untuk industri ${city} dan sekitarnya. Minta penawaran.`,
    eyebrow: `${city}, Indonesia`,
    h1: `Supplier Genset, Generator & Alternator di ${city}`,
    intro: `Indah Machine adalah supplier <strong>genset, generator, dan alternator</strong> di ${city}. Kami menyediakan kepala alternator brushless sinkron, motor listrik, dan komponen untuk pembuat genset, bengkel servis, dan pembeli industri di ${city} dan sekitarnya. ${coverageBody}`,
    productsHeading: `Kepala alternator untuk proyek genset di ${city}`,
    productFamilies: ["Alternator"],
    industriesHeading: `Industri yang kami layani di ${city}`,
    industries: [
      { title: "Perakit genset", body: `OEM dan perakit yang membangun genset diesel di ${city} dan sekitarnya.` },
      { title: "Servis dan refurbishment", body: `Bengkel yang melakukan rewinding atau penggantian kepala alternator pada genset existing.` },
      { title: "Pembeli industri", body: industriesContext },
      { title: "Kontraktor proyek", body: `EPC dan integrator yang menentukan komponen alternator untuk proyek ${city}.` },
    ],
    trustHeading: `Mengapa pelanggan ${city} memilih Indah Machine`,
    trustBody: `Dengan pengalaman lebih dari 50 tahun dan kehadiran di Medan, Jakarta, dan Surabaya, Indah Machine memadukan keahlian teknis mendalam dengan stok dan pengiriman yang andal. Kami mendukung pemilihan kapasitas, instalasi, dan commissioning untuk pelanggan ${city}.`,
    coverageHeading: `Cakupan dan pengiriman ${city}`,
    coverageBody,
    faqHeading: `Pertanyaan umum — ${city}`,
    faqs: [
      {
        q: `Apakah Anda memiliki kantor fisik di ${city}?`,
        a: city === "Medan"
          ? `Ya — kantor pusat kami di Jln. Mangkubumi No. 12, Medan 20151. Kunjungan dengan janji temu.`
          : `Kami mengoperasikan gudang di ${city} untuk stok dan pengiriman. Penjualan, dukungan teknis, dan koordinasi engineering ditangani dari kantor pusat Medan. Hubungi kami untuk pertemuan.`,
      },
      {
        q: `Berapa lead time pengiriman di ${city}?`,
        a: `Lead time tergantung seri, kapasitas, dan stok saat ini di gudang ${city}${city === "Medan" ? "" : " atau Medan HQ"}. Silakan hubungi kami dengan spesifikasi untuk perkiraan pengiriman.`,
      },
      {
        q: `Apakah saya bisa mendapatkan kunjungan lokasi atau konsultasi teknis di ${city}?`,
        a: `Ya. Untuk proyek besar kami mengunjungi ${city} untuk kunjungan lokasi dan commissioning. Konsultasi kecil dapat ditangani jarak jauh via WhatsApp atau video call.`,
      },
      {
        q: `Apakah Anda menjual genset lengkap di ${city}?`,
        a: `Tidak — kami menyuplai kepala alternator dan komponen elektrik, bukan genset diesel lengkap. Kami bekerja sama dengan perakit genset di ${city} yang mendatangkan mesin dan merakit unit lengkap.`,
      },
      {
        q: `Bagaimana cara terbaik meminta penawaran?`,
        a: `WhatsApp +62 853-4867-4326 atau gunakan formulir kontak di website kami. Sertakan kVA / kW, tegangan, frekuensi, dan lokasi proyek Anda.`,
      },
    ],
    crossLinksHeading: "Kota lain dan halaman produk",
    crossLinkSlugs: [
      "alternator-indonesia",
      "motor-listrik-indonesia",
      "genset-indonesia",
      "generator-indonesia",
    ].concat(
      (["genset-medan", "genset-jakarta", "genset-surabaya"] as LandingSlug[]).filter(
        (s) => s !== `genset-${city.toLowerCase()}`
      )
    ),
    ctaHeading: `Bicarakan proyek ${city} Anda dengan kami`,
    ctaBody: `Beritahu kami kVA, tegangan, frekuensi, dan konteks proyek. Kami akan merekomendasikan alternator yang tepat dan menyiapkan penawaran dengan pengiriman ke ${city}.`,
    ctaButtonLabel: "Minta Penawaran",
  };
}

// ---------- Helpers used by pages ----------

export function landingHrefFor(slug: LandingSlug, lang: Lang): string {
  return `/${lang}/${slug}/`;
}

export const slugLabels: Record<LandingSlug, Record<Lang, string>> = {
  "alternator-indonesia": { en: "Alternator Indonesia", id: "Alternator Indonesia" },
  "motor-listrik-indonesia": { en: "Electric Motor Distributor", id: "Distributor Motor Listrik" },
  "generator-indonesia": { en: "Generator Indonesia", id: "Generator Indonesia" },
  "genset-indonesia": { en: "Genset Indonesia", id: "Genset Indonesia" },
  "genset-medan": { en: "Genset Medan", id: "Genset Medan" },
  "genset-jakarta": { en: "Genset Jakarta", id: "Genset Jakarta" },
  "genset-surabaya": { en: "Genset Surabaya", id: "Genset Surabaya" },
};
