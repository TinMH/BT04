export const categories = [
  { id: 'all', name: 'Tất cả Layout' },
  { id: '60-percent', name: 'Layout 60% (Siêu Nhỏ Gọn)' },
  { id: '65-percent', name: 'Layout 65% (Tối Giản)' },
  { id: '75-percent', name: 'Layout 75% (Tiêu Chuẩn Mới)' },
  { id: 'tkl-layout', name: 'Layout 80% TKL (Cổ Điển)' },
  { id: 'fullsize-1800', name: 'Layout 1800 / Fullsize' },
  { id: 'ergo-alice', name: 'Layout Ergonomic / Alice' },
];

export const products = [
  {
    id: 'aeroforge-pro-75',
    name: 'AeroForge Pro 75',
    tagline: 'Premium Gasket-Mounted Mechanical Keyboard',
    description: 'Bàn phím cơ gasket-mounted cao cấp nhất phân khúc với vỏ nhôm CNC nguyên khối siêu nặng, kết nối 3 chế độ (Cáp Type-C, Bluetooth 5.1, Wireless 2.4Ghz) và hotswap 5-pin mạch xuôi. Mang lại cảm giác gõ cực kỳ êm ái, đàn hồi cùng âm thanh "thocky" trầm ấm nguyên bản lý tưởng cho cả người làm việc và game thủ.',
    price: 3250000,
    originalPrice: 3800000,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    soldCount: 342,
    rating: 4.9,
    categoryId: '75-percent',
    size: '75%',
    switchType: 'Linear (Êm Ái, Trơn Tru)',
    connectivity: '3 Chế độ (Dây, Bluetooth, 2.4G)',
    features: 'Gasket Mount, Hotswap 5-pin, Led RGB South-facing, Keycaps PBT Double-shot Cherry Profile, Lube sẵn stab và switch',
    tags: ['Bán chạy nhất', 'Mới nhất', 'Khuyến mãi'],
    comments: [
      { id: 1, user: 'Nguyễn Trần Minh', rating: 5, content: 'Bàn phím gõ siêu êm, âm thanh trầm ấm rất đã tai. Vỏ nhôm nặng trịch cực kỳ sang xịn mịn.', date: '2026-05-10' },
      { id: 2, user: 'Hoàng Quốc Việt', rating: 5, content: 'Dùng kết nối 2.4Ghz cực nhạy không hề delay. Đóng gói cẩn thận, giao hàng siêu nhanh. Đáng tiền!', date: '2026-05-12' },
      { id: 3, user: 'Khánh Linh', rating: 4, content: 'Phím rất đẹp nhưng hơi nặng khi bỏ balo mang đi làm. Cảm giác gõ thì 10/10.', date: '2026-05-15' }
    ]
  },
  {
    id: 'cyberboard-x-60',
    name: 'CyberBoard X 60',
    tagline: 'Ultra-compact Vaporwave Masterpiece',
    description: 'Thiết kế siêu nhỏ gọn tối giản 60% giúp giải phóng tối đa không gian chuột di chuyển. Trang bị bộ vỏ Acrylic Custom xuyên LED rực rỡ cùng với bộ keycaps Vaporwave PBT cao cấp bền bỉ. Mạch hotswap linh hoạt hỗ trợ thay thế nóng switch dễ dàng.',
    price: 1890000,
    originalPrice: 2100000,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    soldCount: 89,
    rating: 4.7,
    categoryId: '60-percent',
    size: '60%',
    switchType: 'Clicky (Vui Tai, Gõ Đanh)',
    connectivity: 'Dây Type-C rời',
    features: 'Acrylic Case đục mờ, Hotswap, Underglow RGB rực rỡ, Foam Mod sẵn từ nhà máy',
    tags: ['Mới nhất', 'Khuyến mãi'],
    comments: [
      { id: 1, user: 'Trần Gia Bảo', rating: 5, content: 'Led RGB cực kỳ sáng, gõ clicky sướng tai. Thiết kế nhỏ gọn giúp bàn làm việc rộng hẳn ra.', date: '2026-05-02' },
      { id: 2, user: 'Lê Minh Tuấn', rating: 4, content: 'Bàn phím đẹp, gõ thích. Tuy nhiên ai thích yên tĩnh thì nên cân nhắc vì switch clicky gõ ban đêm hơi ồn.', date: '2026-05-08' }
    ]
  },
  {
    id: 'retroclassic-tkl',
    name: 'RetroClassic TKL',
    tagline: 'Nostalgic Design, Modern Performance',
    description: 'Lấy cảm hứng nghệ thuật từ những chiếc máy vi tính cổ điển thập niên 90, RetroClassic mang lại một vẻ đẹp hoài cổ tinh tế kết hợp hoàn hảo cùng công nghệ switch cơ học đỉnh cao. Từng stabilizer được cân chỉnh và lube tay mượt mà mang lại sự ổn định tuyệt đối.',
    price: 2450000,
    originalPrice: 2450000,
    discount: 0,
    images: [
      'https://images.unsplash.com/photo-1626908013943-df94de54984c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 24,
    soldCount: 156,
    rating: 4.8,
    categoryId: 'tkl-layout',
    size: '80% (TKL)',
    switchType: 'Tactile (Khấc Cản, Đầm Tay)',
    connectivity: '3 Chế độ (Dây, Bluetooth, 2.4G)',
    features: 'Retro Retro Beige Design, Dye-sub PBT Keycaps dày dặn, Hệ thống foam tiêu âm Silicon cao cấp, Núm xoay đa năng chỉnh volume',
    tags: ['Bán chạy nhất'],
    comments: [
      { id: 1, user: 'Phạm Hải Đăng', rating: 5, content: 'Thiết kế vintage quá hợp với góc setup làm việc của mình. Tiếng khấc khấc gõ văn bản rất sướng tay và không quá ồn.', date: '2026-05-01' }
    ]
  },
  {
    id: 'nomad-split-ergo',
    name: 'Nomad Split Ergonomic Alice',
    tagline: 'Ergonomic Split Mechanical Keyboard',
    description: 'Bàn phím công thái học thiết kế công phu chuẩn layout Alice giúp định hình vị trí tay tự nhiên nhất, triệt tiêu cơn đau nhức cổ tay khi gõ phím cường độ cao liên tục. Trang bị núm xoay kim loại kép và tấm đồng nặng CNC mặt đáy tạo âm thanh đầm chắc.',
    price: 4100000,
    originalPrice: 4500000,
    discount: 9,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    soldCount: 42,
    rating: 5.0,
    categoryId: 'ergo-alice',
    size: 'Alice / Ergonomic',
    switchType: 'Linear (Êm Ái, Trơn Tru)',
    connectivity: '3 Chế độ (Dây, Bluetooth, 2.4G)',
    features: 'Alice Layout bảo vệ tay, Gaskets mount mềm mại, Tạ Brass CNC tinh xảo, Núm xoay đôi CNC cao cấp',
    tags: ['Mới nhất'],
    comments: [
      { id: 1, user: 'Đỗ Tiến Đạt', rating: 5, content: 'Bàn phím công thái học gõ lúc đầu hơi lạ tay nhưng quen rồi thì không muốn quay lại phím thường luôn. Cực kỳ bảo vệ sức khỏe!', date: '2026-05-14' }
    ]
  },
  {
    id: 'aura-98-professional',
    name: 'Aura 98 Professional',
    tagline: 'Full Power, Compact Space',
    description: 'Bàn phím bố cục 98 phím tinh gọn nhưng vẫn giữ lại đầy đủ cụm phím số Numpad vô cùng tiện lợi cho việc nhập liệu, tính toán Excel và viết code. Sử dụng switch Silent cao cấp siêu êm ái triệt tiêu đến 95% tiếng ồn, vô cùng phù hợp sử dụng tại môi trường văn phòng hoặc phòng ngủ.',
    price: 2750000,
    originalPrice: 3100000,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    soldCount: 210,
    rating: 4.6,
    categoryId: 'fullsize-1800',
    size: 'Fullsize / 98%',
    switchType: 'Linear (Êm Ái, Trơn Tru)',
    connectivity: '3 Chế độ (Dây, Bluetooth, 2.4G)',
    features: 'Bố cục 98 phím nhập liệu nhanh, Switch Silent chống ồn đỉnh cao, Hot-swappable dễ thay thế, Đệm tiêu âm đúc Poron cao cấp',
    tags: ['Bán chạy nhất', 'Khuyến mãi'],
    comments: [
      { id: 1, user: 'Lê Thùy Dương', rating: 5, content: 'Đúng là cứu cánh cho dân kế toán như mình. Đầy đủ phím số mà gõ lại cực kỳ êm ái không sợ ảnh hưởng đến đồng nghiệp xung quanh.', date: '2026-05-09' },
      { id: 2, user: 'Phạm Thế Hùng', rating: 4, content: 'Sản phẩm tốt, kết nối Bluetooth rất mượt mà. Tuy nhiên đèn nền led hơi mờ một chút so với bản custom nhôm.', date: '2026-05-11' }
    ]
  },
  {
    id: 'ghost-stealth-65',
    name: 'Ghost Stealth 65',
    tagline: 'Sleek Dark Mode Workhorse',
    description: 'Phiên bản bàn phím cơ Obsidian Stealth đen nhám bóng đêm bí ẩn cực chất. Vỏ nhôm nguyên khối anot hóa tĩnh điện mịn màng, switch Black Linear nặng tay đầy phản hồi cơ học nhạy bén kết hợp led gầm RGB có thể custom vô tận qua phần mềm độc quyền.',
    price: 2150000,
    originalPrice: 2400000,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626908013943-df94de54984c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 0, // Hết hàng!
    soldCount: 135,
    rating: 4.8,
    categoryId: '65-percent',
    size: '65%',
    switchType: 'Linear (Êm Ái, Trơn Tru)',
    connectivity: 'Kết nối dây Type-C',
    features: 'Vỏ nhôm CNC Anodized đen nhám, Stab Screw-in chống lọc xọc cực đỉnh, Led RGB South-facing, Keycaps PBT Double-shot Ninja ký tự phụ bên hông',
    tags: ['Khuyến mãi'],
    comments: [
      { id: 1, user: 'Đinh Công Thành', rating: 5, content: 'Case nhôm đen nhám nhìn ngầu vô cùng, kết hợp góc setup đen tối giản là hết sảy. Rất tiếc hiện đang hết hàng để mua tặng thêm cho em trai.', date: '2026-05-15' }
    ]
  }
];

export const promotions = [
  { id: 'VIPMEM', discount: 15, description: 'Giảm 15% cho thành viên VIP đăng nhập thành công', minPurchase: 2000000 },
  { id: 'WELCOME50', discount: 5, description: 'Giảm 5% cho khách hàng mới', minPurchase: 0 },
  { id: 'FORGECODE', discount: 10, description: 'Mã giảm giá đặc biệt 10% mừng ra mắt dòng AeroForge Pro', minPurchase: 3000000 }
];

export const articles = [
  {
    id: 'lube-switch-guide',
    title: 'Hướng dẫn tự Lube Switch bàn phím cơ cực chi tiết từ A-Z',
    summary: 'Bạn muốn tối ưu hóa cảm giác gõ và âm thanh của bàn phím cơ? Lube switch là bước quan trọng nhất mà bất cứ dân chơi bàn phím cơ nào cũng nên trải nghiệm.',
    content: `Tự lube switch (tra dầu bôi trơn) bàn phím cơ luôn là một trong những cột mốc thú vị nhất đối với người mới chơi phím cơ. Quá trình này không chỉ làm giảm tiếng ma sát lạo xạo khó chịu của lò xo và chân stem mà còn mang lại cảm giác gõ trơn tru mịn màng tuyệt hảo, cùng âm thanh "thocky" đầy trầm ấm.

### 1. Chuẩn bị dụng cụ
Để bắt đầu lube switch, bạn cần chuẩn bị đầy đủ các dụng cụ cơ bản sau:
- **Dầu bôi trơn:** Krytox GPL 205g0 (phổ biến nhất cho stem và housing) và Krytox 105 (bôi trơn lò xo).
- **Cọ vẽ:** Size 00 hoặc 0 để quẹt dầu đều nhất.
- **Switch Opener:** Dụng cụ để bung switch ra.
- **Stem Picker (hoặc nhíp nhọn):** Giúp gắp giữ stem của switch dễ dàng hơn mà không bám dầu ra tay.
- **Lube Station:** Khay nhựa để sắp xếp các bộ phận switch ngăn nắp trong quá trình làm.

### 2. Các bước tiến hành tỉ mỉ
- **Bước 1 (Mở switch):** Sử dụng Switch Opener đặt switch lên trên và nhấn nhẹ để mở bung 4 ngàm giữ khóa, tách switch thành 4 phần riêng biệt gồm Top Housing, Bottom Housing, Stem và Lò xo.
- **Bước 2 (Lube Stem):** Chấm một lượng dầu rất nhỏ Krytox 205g0 lên đầu cọ. Thoa đều lên hai bên rãnh trượt (slider rails), mặt trước và mặt sau của chân stem. Lưu ý quét lớp dầu thật mỏng và đều, tránh quét quá dày sẽ gây "over-lube" làm phím bị dính lướt gõ nặng nề.
- **Bước 3 (Lube Bottom Housing):** Dùng cọ bôi nhẹ vào hai đường rãnh trượt bên trong bottom housing và phần trụ đỡ ở giữa.
- **Bước 4 (Lube Lò xo):** Dùng dầu Krytox 105 nhỏ vào lò xo rồi lắc đều (bag lube) hoặc quét nhẹ Krytox 205g0 lên hai đầu vòng xoắn của lò xo để triệt tiêu tiếng ping lò xo đập vào vỏ.
- **Bước 5 (Ráp lại switch):** Lắp lò xo vào bottom housing, đặt stem lên trên và đóng top housing lại cho đến khi nghe tiếng tách khớp chặt chẽ.

Hãy kiên nhẫn trải nghiệm từng phím, bạn sẽ nhận lại thành quả hoàn toàn xứng đáng với công sức bỏ ra!`,
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-15',
    author: 'Nguyễn Tiến Dũng (Keyboard Expert)'
  },
  {
    id: 'keycap-profiles-comparison',
    title: 'So sánh các Profile Keycap phổ biến nhất hiện nay: Cherry, OEM, SA',
    summary: 'Độ cao và độ nghiêng của keycap ảnh hưởng rất nhiều đến tư thế gõ phím. Bài viết giúp bạn phân biệt và chọn lựa profile phù hợp nhất.',
    content: `Keycap Profile chính là hình dạng, độ cao và độ nghiêng của từng dòng keycaps trên bàn phím của bạn. Nhiều người mới thường bỏ qua thông số này, nhưng thực tế nó lại quyết định phần lớn tư thế đặt tay, cảm giác gõ thoải mái và cả âm thanh phát ra khi gõ.

### 1. Profile Cherry - Chuẩn mực công thái học
Được phát minh bởi hãng Cherry huyền thoại của Đức, đây được xem là tiêu chuẩn vàng của thế giới custom phím cơ.
- **Đặc điểm:** Chiều cao phím khá thấp, độ nghiêng được thiết kế khoa học ôm sát theo cử động tự nhiên của ngón tay.
- **Ưu điểm:** Gõ cực kỳ nhanh, thoải mái trong thời gian dài mà không bị mỏi cổ tay. Cho âm thanh trầm ấm rất cân bằng.
- **Thích hợp:** Người gõ văn bản chuyên nghiệp, lập trình viên, game thủ.

### 2. Profile OEM - Mặc định và thân thuộc
OEM (Original Equipment Manufacturer) là profile cực kỳ phổ biến mà 90% bàn phím cơ thương mại đúc sẵn (Pre-built) sử dụng.
- **Đặc điểm:** Tương tự như Cherry profile nhưng có chiều cao lớn hơn khoảng 1.5 - 2mm và độ vát sắc cạnh hơn một chút.
- **Ưu điểm:** Quen tay, dễ làm quen, sản xuất hàng loạt nên giá thành cực kỳ dễ chịu với đa dạng phối màu.

### 3. Profile SA - Nữ hoàng cổ điển quyến rũ
SA (Spherical All) là profile keycaps cao cấp với hình dáng cao vượt trội và bề mặt phím lõm hình cầu sâu ôm trọn đầu ngón tay.
- **Đặc điểm:** Keycaps rất cao, đầm tay, vỏ phím dày dặn. Khi gõ tạo nên âm thanh "clack" vang vọng đặc thù rất đã tai.
- **Ưu điểm:** Ngoại hình vô cùng sang trọng, độc đáo mang đậm chất retro vintage cổ điển.
- **Nhược điểm:** Phím cao nên bắt buộc phải trang bị thêm đệm kê tay (wrist rest) để tránh mỏi tay khi sử dụng lâu dài.

Chúc các bạn sớm tìm được profile chân ái của cuộc đời mình!`,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-12',
    author: 'Lê Hoàng Dương (Designer & Collector)'
  },
  {
    id: 'gasket-mount-vs-tray-mount',
    title: 'Gasket Mount là gì? Tại sao nó trở thành tiêu chuẩn vàng của phím cơ?',
    summary: 'Tìm hiểu chi tiết cấu trúc Gasket Mount so với Tray Mount truyền thống và lý do tại sao nó tạo nên cơn sốt trên toàn thế giới.',
    content: `Trong thế giới bàn phím cơ custom ngày nay, cụm từ "Gasket Mounted" xuất hiện ở hầu khắp mọi sản phẩm từ phân khúc trung cấp đến cao cấp. Vậy cấu trúc này có gì đặc biệt khiến nó đánh bại cấu trúc Tray Mount truyền thống?

### 1. Cấu trúc Tray Mount truyền thống
Tray Mount là kiểu thiết kế cơ bản, trong đó tấm Plate và PCB của bàn phím sẽ được bắt vít trực tiếp vào các cột trụ có sẵn của bộ vỏ (Case).
- **Hạn chế:** Các điểm bắt vít trực tiếp này tạo nên những "điểm cứng" (stiff points). Khi gõ tại các phím gần ốc vít, bạn cảm thấy rất cứng và phản hồi lực dội ngược lại ngón tay gây mỏi. Ngoài ra âm thanh gõ cũng không được đều đặn trên toàn bộ bề mặt phím.

### 2. Cấu trúc Gasket Mount cách tân
Gasket Mount loại bỏ hoàn toàn các điểm vít cứng nhắc giữa plate và case. Thay vào đó, plate bàn phím được kẹp chặt ở giữa nửa vỏ trên (Top Case) và nửa vỏ dưới (Bottom Case) thông qua các miếng đệm làm bằng chất liệu đàn hồi như cao su, silicon hoặc bọt Poron (gọi là Gaskets).
- **Lợi ích tuyệt vời:**
  - **Sự nhún nhảy đàn hồi (Flex):** Khi bạn gõ mạnh, toàn bộ tấm plate và PCB sẽ nhún nhẹ xuống theo miếng đệm gasket, triệt tiêu lực dội mạnh giúp ngón tay vô cùng êm ái thư giãn.
  - **Âm thanh đồng đều (Sound Profile):** Nhờ cách ly tấm plate tiếp xúc cứng trực tiếp với case nhôm, tiếng gõ phím trở nên trầm hơn, ấm hơn ("thocky") và triệt tiêu hoàn toàn các âm thanh vang chói khó chịu của vỏ kim loại rỗng.

Đó chính là lý do tại sao mẫu AeroForge Pro 75 của chúng tôi lại sử dụng Gasket Mount làm cốt lõi để mang lại trải nghiệm gõ hàng đầu cho khách hàng!`,
    image: 'https://images.unsplash.com/photo-1626908013943-df94de54984c?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-05',
    author: 'Bùi Thế Anh (R&D Engineer)'
  }
];

export const members = [
  { username: 'member', password: '123456', name: 'Nguyễn Văn A', role: 'Thành viên VIP', discountCode: 'VIPMEM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=A' },
  { username: 'admin', password: '123456', name: 'Lê Hoàng Admin', role: 'Quản trị viên', discountCode: 'VIPMEM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' }
];
