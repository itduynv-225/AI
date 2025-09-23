import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { editImageWithPrompt } from './services/geminiService';
import { ImageFile, Prompt } from './types';
import { PromptSelector } from './components/PromptSelector';
import { LoginModal } from './components/LoginModal';
import { EditPromptsModal } from './components/EditPromptsModal';
import { SavePromptModal } from './components/SavePromptModal';

const defaultPrompts: Prompt[] = [
  { label: "Cô Dâu Chú Rể", maleText: "A hyper-realistic wedding portrait of a handsome groom (use upload photo) holding a bouquet of fresh flowers close to his face. He is wearing an elegant, tailored tuxedo, perfectly fitted to his figure. The tuxedo is sharp, detailed, and luxurious just like the reference photo. His hair is neatly styled, matching the hairstyle in the reference.", femaleText: "A hyper-realistic bridal portrait of a beautiful bride (use upload photo) holding a bouquet of fresh flowers close to her face. She is wearing an elegant lace embroidered bridal gown, sleeveless with a daring V-cut back design, perfectly fitted to her figure. The gown is intricate, detailed, and delicate just like the reference photo. A long sheer veil flows softly behind her. Her hair is styled in a loose romantic bun with gentle strands framing her face, matching the hairstyle in the reference." },
  { label: "Áo dài trắng", maleText: "", femaleText: "A bright and elegant outdoor portrait of a young Vietnamese woman in traditional áo dài. She is wearing a pure white áo dài that flows naturally, highlighting her slim and graceful figure. On her head is a simple white nón lá (Vietnamese conical hat) casting soft patterned shadows on her smiling face. She has long straight brown hair that falls naturally over her back. In her hands, she holds a large bouquet of fresh white lilies, symbolizing purity and grace. On her arm hangs a woven straw bag decorated with a delicate fabric flower. Her pose is turned slightly back toward the camera, one hand gently lifting the edge of the nón lá, with a radiant smile. The background is softly blurred, sunlit, and filled with warm natural light, giving the entire scene a dreamy, nostalgic feeling. Use the exact face from the uploaded image, preserving all natural details and expressions accurately." },
  { label: "Vespa Dạo Phố", maleText: "Cinematic ultra-detailed portrait of a handsome Vietnamese man (preserve uploaded face vector). He is wearing a traditional pure white ao dai, long sleeves, elegant and flowing, riding a classic white Vespa scooter. His black hair flows naturally in the wind, graceful posture, calm and confident facial expression. Background: old French colonial architecture in Hanoi, yellow walls with green windows, busy street scene with blurred people, colorful umbrellas, and soft urban atmosphere. Lighting: natural daylight, smooth tones, pastel yet realistic color palette. Hyperrealistic photography style, full body, high detail, 8K resolution, aspect ratio 9:16.", femaleText: "Cinematic ultra-detailed portrait of a beautiful Vietnamese woman (preserve uploaded face vector). She is wearing a traditional pure white ao dai, long sleeves, elegant and flowing, riding a classic white Vespa scooter. Her black hair flows naturally in the wind, graceful posture, calm and confident facial expression. Background: old French colonial architecture in Hanoi, yellow walls with green windows, busy street scene with blurred people, colorful umbrellas, and soft urban atmosphere. Lighting: natural daylight, smooth tones, pastel yet realistic color palette. Hyperrealistic photography style, full body, high detail, 8K resolution, aspect ratio 9:16." },
  { label: "Du Lịch Grand Canyon.USA", maleText: "a man poses at a scenic viewpoint of the Grand Canyon, Arizona, USA. use upload photo, adjust the subject's scale naturally to fit the vast natural landscape. The backdrop shows the dramatic red rock formations, steep cliffs, and deep canyon layers stretching to the horizon. The sunlight creates warm golden tones across the rocks, enhancing the sense of grandeur. The atmosphere is adventurous and awe-inspiring, captured in natural daylight under a clear sky. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16.", femaleText: "a people poses at a scenic viewpoint of the Grand Canyon, Arizona, USA. use upload photo, adjust the subject's scale naturally to fit the vast natural landscape. The backdrop shows the dramatic red rock formations, steep cliffs, and deep canyon layers stretching to the horizon. The sunlight creates warm golden tones across the rocks, enhancing the sense of grandeur. The atmosphere is adventurous and awe-inspiring, captured in natural daylight under a clear sky. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16." },
  { label: "Ăn Mày", maleText: "Use my photo in Ultra-realistic full body photo of a man based on the reference photo (keep the exact same natural face, unchanged) but put mess and crample hair . He is standing and facing the camera, wearing torn and rugged clothes with ripped denim short pants. He is holding two large plastic sacks filled with a mix of Philippine peso bills — 1000 and 500 peso notes, and the other bag is coins visibly overflowing. The background is a realistic dumpsite area, with scattered garbage, smoky atmosphere, and some burning trash in the distance. Cinematic lighting, gritty details, highly realistic textures. 9:16 aspect ratio.", femaleText: "Use my photo in Ultra-realistic full body photo of a woman based on the reference photo (keep the exact same natural face, unchanged) but put mess and crample hair . She is standing and facing the camera, wearing torn and rugged clothes with ripped denim short pants. He is holding two large plastic sacks filled with a mix of Philippine peso bills — 1000 and 500 peso notes, and the other bag is coins visibly overflowing. The background is a realistic dumpsite area, with scattered garbage, smoky atmosphere, and some burning trash in the distance. Cinematic lighting, gritty details, highly realistic textures. 9:16 aspect ratio." },
  { label: "Du Lịch Bali", maleText: "", femaleText: "A cinematic travel portrait of a young woman (use upload photo) sitting gracefully on the cliffside at Kelingking Beach, Nusa Penida, Bali. She is wearing a flowing bright yellow dress that flutters naturally in the ocean breeze. Behind her is the iconic T-Rex shaped cliff, turquoise sea, and white sandy beach, captured in high resolution with vibrant colors. The mood is dreamy, adventurous, and elegant. Keep the outfit, pose, and background exactly the same — only replace the face with the one from the uploaded photo, preserving all natural features and expressions." },
  { label: "Bên cửa sổ", maleText: "A handsome young man in traditional Asian style, standing by an old wooden window, holding a bouquet of white lilies. He wears a light turquoise changshan suit with delicate details, his long black hair flowing down naturally. His grooming is soft and elegant, with pearl earrings adding a touch of refinement. Keep the face and expression from the uploaded photo. The setting is a rustic wooden house with intricate carvings, lit by soft natural light that creates a dreamy, cinematic atmosphere. His skin is fair and glowing, with a gentle expression that exudes grace and timeless handsomeness.", femaleText: "A beautiful young woman in traditional Asian style, standing by an old wooden window, holding a bouquet of white lilies. She wears a light turquoise qipao dress with delicate details, her long black hair flowing down naturally. Her makeup is soft and elegant, with pearl earrings adding a touch of refinement. Keep the face and expression from the uploaded photo. The setting is a rustic wooden house with intricate carvings, lit by soft natural light that creates a dreamy, cinematic atmosphere. Her skin is fair and glowing, with a gentle expression that exudes grace and timeless beauty." },
  { label: "Biển", maleText: "A young man(use upload photo) stands on a seaside trail with a backdrop of massive rocky cliffs and turquoise ocean waves crashing against the shore. The warm golden sunlight of the afternoon enhances the romantic and natural atmosphere. He has a handsome face, fair glowing skin, light natural grooming, and soft lips. Keep the exact face and expression from the uploaded photo\nHis long black hair is styled in large loose waves, flowing gracefully in the sea breeze. He is wearing a flowing cream-white linen shirt, unbuttoned at the collar, made of light airy fabric, paired with light trousers. A small beige woven canvas shoulder bag hangs from his shoulder, his right hand lightly holding the strap, while his left hand rests naturally by his side.\nHis head is tilted slightly, eyes closed, with a gentle smile of serenity and contentment. The photo has a dreamy, travel-photography style, with natural sunlight, crisp clear tones, and highly detailed realism, capturing both elegance and freedom.", femaleText: "A young woman(use upload photo) stands on a seaside trail with a backdrop of massive rocky cliffs and turquoise ocean waves crashing against the shore. The warm golden sunlight of the afternoon enhances the romantic and natural atmosphere. She has a beautiful face, fair glowing skin, light natural makeup, and soft red lips. Keep the exact face and expression from the uploaded photo \nHer long black hair is styled in large loose waves, flowing gracefully in the sea breeze. She is wearing a flowing cream-white maxi dress, halter neckline with crossed straps in front, made of light airy fabric. A small beige woven straw bag hangs from her shoulder, her right hand lightly holding the strap, while her left hand rests naturally by her side. \nHer head is tilted slightly, eyes closed, with a gentle smile of serenity and contentment. The photo has a dreamy, travel-photography style, with natural sunlight, crisp clear tones, and highly detailed realism, capturing both elegance and freedom." },
  { label: "Cà Phê 1", maleText: "Use this photo for A warm, cozy lifestyle moment of a young man relaxing at a sunny outdoor café. He wears a comfortable cream sweater, light blue cropped jeans, and white ankle boots. His hair is tied back in a relaxed low bun, with stylish simple necklace completing the look. He’s sipping coffee while reading a book, sitting on a wicker café chair at a small round table with a glass of water.", femaleText: "Use this photo for A warm, cozy lifestyle moment of a young woman relaxing at a sunny outdoor café. She wears a comfortable cream sweater, light blue cropped jeans, and white ankle boots. Her hair is tied back in a relaxed low bun, with stylish simple necklace completing the look. She’s sipping coffee while reading a book, sitting on a wicker café chair at a small round table with a glass of water." },
  { label: "Cà Phê 2", maleText: "", femaleText: "A slim young woman (use upload photo) with fair, radiant skin is sitting elegantly at a Parisian outdoor café table. She is wearing a chic white beret, oversized black sunglasses, a fitted white blazer, and sheer floral embroidered tights in pastel pink and green, paired with pointed-toe white high heels. A quilted black leather designer handbag with a gold chain rests on the table. She gracefully holds a white porcelain teacup with one hand, her other hand touching her face in a poised gesture. Behind her is the classic Haussmann-style Parisian architecture with cream-colored stone buildings, wrought-iron balconies, and large windows. Green plants in black planters add a touch of freshness to the setting. The framing should match the reference photo: full-body seated pose, slightly angled perspective, with natural daylight creating a sophisticated and luxurious Parisian café scene. Keep everything exactly the same — outfit, accessories, background, and composition — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. Ultra high resolution, cinematic, photorealistic quality." },
  { label: "Ga tàu", maleText: "A slim young man (use upload photo) with fair, radiant skin is sitting elegantly on a metal bench at a European train station platform, in front of the “Los Angeles Station” signboard and timetable boards in the background. He is dressed in a beige tailored suit with a relaxed fit, a plain white t-shirt inside, and white Converse sneakers. A black leather shoulder bag rests casually on his side, and he is holding a takeaway coffee cup with both hands, gazing thoughtfully ahead. His long, dark, wavy hair flows naturally, complementing his chic and modern look. The environment shows train tracks, blurred commuters, and the architectural details of the station’s glass roof and steel structure. Framing should match the reference image: a three-quarter body shot, seated position, slightly side-facing angle, with soft natural daylight. Keep everything exactly the same — outfit, accessories, background, lighting, and composition — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. High resolution, photorealistic, cinematic quality.", femaleText: "A slim young woman (use upload photo) with fair, radiant skin is sitting elegantly on a metal bench at a European train station platform, in front of the “Los Angeles Station” signboard and timetable boards in the background. She is dressed in a beige tailored suit with a relaxed fit, a plain white t-shirt inside, and white Converse sneakers. A black leather shoulder bag rests casually on her side, and she is holding a takeaway coffee cup with both hands, gazing thoughtfully ahead. Her long, dark, wavy hair flows naturally, complementing her chic and modern look. The environment shows train tracks, blurred commuters, and the architectural details of the station’s glass roof and steel structure. Framing should match the reference image: a three-quarter body shot, seated position, slightly side-facing angle, with soft natural daylight. Keep everything exactly the same — outfit, accessories, background, lighting, and composition — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. High resolution, photorealistic, cinematic quality." },
  { label: "CEO", maleText: "Đây là một bức ảnh chụp độ phân giải cao của một người đàn ông châu Á, khoảng cuối tuổi 30 đến đầu 40, đang ngồi tại một chiếc bàn chủ tịch lớn. Anh có làn da sáng, mái tóc đen ngắn , đeo kính gọng mảnh trong suốt với chi tiết bạc tinh tế ở phần gọng. Trang phục của anh mang phong cách trang trọng và quyền lực: bộ vest xanh navy may đo vừa vặn, áo sơ mi trắng tinh khôi và cà vạt lụa cao cấp. Anh đeo thêm đồng hồ sang trọng và ghim áo bạc nhỏ tinh tế. Chiếc bàn chủ tịch làm bằng gỗ tối màu bóng loáng, bề mặt hiện đại và sang trọng. Trên bàn có tài liệu được sắp xếp gọn gàng, một cây bút máy cao cấp, và một chiếc laptop bạc đang mở. Ngoài ra còn có một tập hồ sơ bọc da và một tạp chí thương hiệu, tạo cảm giác chuyên nghiệp và uy tín. Phông nền là bức tường màu xám sáng, làm nổi bật nhân vật và không gian văn phòng. Chiếc ghế anh ngồi là ghế da cao cấp, lưng cao, thể hiện sự quyền lực và tinh tế. Tổng thể bức ảnh mang tính quyền lực, sang trọng và hiện đại, nhấn mạnh thần thái của một vị chủ tịch trong môi trường doanh nghiệp đẳng cấp. Lưu ý: giữ nguyên khuôn mặt, kiểu tóc từ ảnh gốc đã tải lên.", femaleText: "Đây là một bức ảnh chụp độ phân giải cao của một người phụ nữ châu Á, khoảng cuối tuổi 30 đến đầu 40, đang ngồi tại một chiếc bàn chủ tịch lớn. Cô có làn da sáng, đeo kính gọng mảnh trong suốt với chi tiết bạc tinh tế ở phần gọng. Trang phục của cô mang phong cách trang trọng và quyền lực: bộ vest xanh navy may đo vừa vặn, áo sơ mi trắng tinh khôi và khăn lụa cao cấp. Cô đeo thêm đồng hồ sang trọng và ghim áo bạc nhỏ tinh tế. Chiếc bàn chủ tịch làm bằng gỗ tối màu bóng loáng, bề mặt hiện đại và sang trọng. Trên bàn có tài liệu được sắp xếp gọn gàng, một cây bút máy cao cấp, và một chiếc laptop bạc đang mở. Ngoài ra còn có một tập hồ sơ bọc da và một tạp chí thương hiệu, tạo cảm giác chuyên nghiệp và uy tín. Phông nền là bức tường màu xám sáng, làm nổi bật nhân vật và không gian văn phòng. Chiếc ghế cô ngồi là ghế da cao cấp, lưng cao, thể hiện sự quyền lực và tinh tế. Tổng thể bức ảnh mang tính quyền lực, sang trọng và hiện đại, nhấn mạnh thần thái của một nữ chủ tịch trong môi trường doanh nghiệp đẳng cấp. Lưu ý: giữ nguyên khuôn mặt, kiểu tóc từ ảnh gốc đã tải lên." },
  { label: "Nhiếp ảnh", maleText: "A stylish Vietnam man (use upload photo) sitting casually on the roadside in the city, holding a vintage camera, wearing a chic black blazer with slim-fit trousers, white socks and black loafers, paired with a brown leather shoulder bag, captured in warm vintage film tones, soft grain, slightly faded colors, nostalgic and cinematic mood, golden hour sunlight, retro street fashion photography", femaleText: "A stylish Vietnam woman (use upload photo) sitting casually on the roadside in the city, holding a vintage camera, wearing a chic black blazer with a mini skirt, white socks and black loafers, paired with a brown leather shoulder bag, captured in warm vintage film tones, soft grain, slightly faded colors, nostalgic and cinematic mood, golden hour sunlight, retro street fashion photography" },
  { label: "Cổ trang", maleText: "A stunning young man in traditional Chinese Hanfu, wearing a flowing pastel peach and cream embroidered robe with golden floral patterns. He holds an elegant Chinese round fan in his hand. His hair is styled in an elaborate Tang dynasty-inspired updo with ornate floral headpieces, tassels, and pearl accessories. Keep the face and expression from the uploaded photo. He stands gracefully in front of a traditional Chinese window with carved wooden details, bathed in soft natural light with gentle shadows. The atmosphere is elegant, cinematic, and reminiscent of classical Chinese male beauty portraits.", femaleText: "A stunning young woman in traditional Chinese Hanfu, wearing a flowing pastel peach and cream embroidered robe with golden floral patterns. She holds an elegant Chinese round fan in her hand. Her hair is styled in an elaborate Tang dynasty-inspired updo with ornate floral headpieces, tassels, and pearl accessories. Keep the face and expression from the uploaded photo. She stands gracefully in front of a traditional Chinese window with carved wooden details, bathed in soft natural light with gentle shadows. The atmosphere is elegant, cinematic, and reminiscent of classical Chinese beauty portraits." },
  { label: "Doreamon", maleText: "A hyper-realistic nostalgic 1990s Vietnamese photo of me in the photo I uploaded, sitting on the patterned cement-tile floor of an old family living room, facing a retro CRT box TV. I wear a plain white T-shirt and simple black shorts, with plastic sandals. While sitting and watching TV, I turn my head back slightly toward the camera, looking directly at the lens with a very subtle, tiny smile. Beside me sit two life-sized characters: Doraemon and Nobita, both real, alive, cheerful, and natural, like childhood friends brought into reality. On the old CRT TV screen in front of me, the classic Doraemon anime is playing, clearly showing Doraemon and Nobita inside the screen. The room has vintage cement tiles, pale green or yellow painted walls, a wall calendar, and a standing fan in the corner, all lit with warm golden lighting. The atmosphere feels cozy, nostalgic, and cinematic, recreating the vibe of a typical Vietnamese home in the 1990s.", femaleText: "A hyper-realistic nostalgic 1990s Vietnamese photo of me in the photo I uploaded, sitting on the patterned cement-tile floor of an old family living room, facing a retro CRT box TV. I wear a plain white T-shirt and simple black shorts, with plastic sandals. While sitting and watching TV, I turn my head back slightly toward the camera, looking directly at the lens with a very subtle, tiny smile. Beside me sit two life-sized characters: Doraemon and Nobita, both real, alive, cheerful, and natural, like childhood friends brought into reality. On the old CRT TV screen in front of me, the classic Doraemon anime is playing, clearly showing Doraemon and Nobita inside the screen. The room has vintage cement tiles, pale green or yellow painted walls, a wall calendar, and a standing fan in the corner, all lit with warm golden lighting. The atmosphere feels cozy, nostalgic, and cinematic, recreating the vibe of a typical Vietnamese home in the 1990s." },
  { label: "Dù lượn Dubai", maleText: "Ultra-realistic wide-angle selfie photo of a person (attached photo) skydiving high above the Palm Jumeirah, Dubai. The subject wears a black jumpsuit with secure parachute harness and transparent protective goggles. Their hair is blown upward by the wind, expression joyful and excited. The parachute straps and lines are visible above him. Below, the iconic artificial palm-shaped island is clearly seen surrounded by turquoise waters and white sandy edges.", femaleText: "Ultra-realistic wide-angle selfie photo of a person (attached photo) skydiving high above the Palm Jumeirah, Dubai. The subject wears a black jumpsuit with secure parachute harness and transparent protective goggles. Their hair is blown upward by the wind, expression joyful and excited. The parachute straps and lines are visible above him. Below, the iconic artificial palm-shaped island is clearly seen surrounded by turquoise waters and white sandy edges." },
  { label: "Du Lịch Fansipan", maleText: "a man poses at the Fansipan summit in Sapa, Lao Cai, Vietnam. use upload photo, adjust the subject's scale naturally to fit the majestic mountain landscape. The backdrop shows the iconic Fansipan peak with its triangular summit marker, surrounded by clouds floating below and the vast Hoang Lien Son mountain range stretching into the distance. Colorful prayer flags and the grand Fansipan pagoda complex can be seen nearby, adding authenticity to the scene. The atmosphere is inspiring and adventurous, captured in bright natural daylight above the clouds. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16.", femaleText: "a women poses at the Fansipan summit in Sapa, Lao Cai, Vietnam. use upload photo, adjust the subject's scale naturally to fit the majestic mountain landscape. The backdrop shows the iconic Fansipan peak with its triangular summit marker, surrounded by clouds floating below and the vast Hoang Lien Son mountain range stretching into the distance. Colorful prayer flags and the grand Fansipan pagoda complex can be seen nearby, adding authenticity to the scene. The atmosphere is inspiring and adventurous, captured in bright natural daylight above the clouds. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16." },
  { label: "Trang phục Hàn", maleText: `A full-body portrait of a young man (use upload photo) wearing a traditional Korean hanbok, standing gracefully under blooming cherry blossom trees in spring. The hanbok consists of a delicate white jeogori (short jacket) paired with flowing baji (trousers) in gradient shades of soft blue, soft layers creating a dreamy and elegant look. He holds a tassel ornament at his waist, and his hair is styled in an elegant topknot adorned with subtle hair ornaments. He gazes slightly to the side with a serene and graceful expression, surrounded by branches of cherry blossoms in full bloom. The background shows lush green trees with sunlight filtering through, creating a soft and romantic spring atmosphere. Cinematic, ultra-realistic style with vivid details. IMPORTANT: Preserve the exact face, identity, and expression from the uploaded reference photo without any changes. The face is the highest priority and must match the uploaded image perfectly.",
  "style": "Cinematic, ultra-realistic photography, traditional Korean aesthetic, detailed textures",
  "lighting": "Soft natural daylight, warm highlights, gentle shadows, glowing spring light",
  "mood": "Romantic, serene, cultural, elegant",
  "camera": {
    "shot": "Full body, slightly angled but face visible, eye-level perspective",
    "focus": "Strong focus on subject’s face from the uploaded photo (priority), background softly blurred",
    "aspect_ratio": "9:16"
  },
  "details": {
    "face": "Use uploaded image for exact facial features, identity, and expression. Do not modify.",
    "outfit": {
      "jeogori": "White, delicate, traditional short jacket",
      "baji": "Flowing trousers in gradient shades of soft blue",
      "accessories": "Tassel ornament, subtle hair ornament"
    },
    "background": "Cherry blossom trees in full bloom, green spring foliage, natural park setting"
  },
  "size": "1024x1820",
  "referenced_image_ids": ["file-4687KEa1dZ5m69rqoxsrzc"]`, femaleText: `A full-body portrait of a young woman (use upload photo) wearing a traditional Korean hanbok, standing gracefully under blooming cherry blossom trees in spring. The hanbok consists of a delicate white jeogori (short jacket) paired with a flowing chima (long skirt) in gradient shades of pink, soft layers creating a dreamy and elegant look. She holds a tassel ornament at her waist, and her hair is styled in an elegant low bun adorned with floral accessories. She gazes slightly to the side with a serene and graceful expression, surrounded by branches of cherry blossoms in full bloom. The background shows lush green trees with sunlight filtering through, creating a soft and romantic spring atmosphere. Cinematic, ultra-realistic style with vivid details. IMPORTANT: Preserve the exact face, identity, and expression from the uploaded reference photo without any changes. The face is the highest priority and must match the uploaded image perfectly.",
  "style": "Cinematic, ultra-realistic photography, traditional Korean aesthetic, detailed textures",
  "lighting": "Soft natural daylight, warm highlights, gentle shadows, glowing spring light",
  "mood": "Romantic, serene, cultural, elegant",
  "camera": {
    "shot": "Full body, slightly angled but face visible, eye-level perspective",
    "focus": "Strong focus on subject’s face from the uploaded photo (priority), background softly blurred",
    "aspect_ratio": "9:16"
  },
  "details": {
    "face": "Use uploaded image for exact facial features, identity, and expression. Do not modify.",
    "outfit": {
      "jeogori": "White, delicate, traditional short jacket",
      "chima": "Flowing skirt in gradient shades of pink",
      "accessories": "Tassel ornament, floral hair accessory"
    },
    "background": "Cherry blossom trees in full bloom, green spring foliage, natural park setting"
  },
  "size": "1024x1820",
  "referenced_image_ids": ["file-4687KEa1dZ5m69rqoxsrzc"]` },
  { label: "Hoa cức lợn", maleText: "Create a portrait image of my face.\nCompositional portrait, dreamy floral gaze, golden hour, cinematic close-up of me, filtered sunlight through wild flowers castling intricate shadows on skin, soft film grain, muted green pallete, 85 mm lenses f/1.4, sharp skin texture, subtle freckles, glossy lips, delicate broken, zero over processing-ar 3:6 -v 6-style no text watermark distortion wearing a white linen shirt.", femaleText: "Create a portrait image of my face.\nCompositional portrait, dreamy floral gaze, golden hour, cinematic close-up of me, filtered sunlight through wild flowers castling intricate shadows on skin, soft film grain, muted green pallete, 85 mm lenses f/1.4, sharp skin texture, subtle freckles, glossy lips, delicate broken, zero over processing-ar 3:6 -v 6-style no text watermark distortion wearing a white off shoulder." },
  { label: "Du lịch Hội An", maleText: "a man poses in the ancient town of Hoi An at night, Quang Nam, Vietnam. use upload photo, adjust the subject's scale naturally to fit the cultural heritage scene. The backdrop shows rows of traditional yellow-walled houses with tiled roofs, colorful lanterns hanging and glowing warmly, reflecting on the Thu Bon River. Small boats can be seen floating on the water, adding authenticity to the scene. The atmosphere is vibrant yet nostalgic, filled with the charm of a UNESCO World Heritage site. Shot from an eye-level angle, illuminated by lantern lights, the photo style is clean and crisp, typical of travel and cultural photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16.", femaleText: "a women poses in the ancient town of Hoi An at night, Quang Nam, Vietnam. use upload photo, adjust the subject's scale naturally to fit the cultural heritage scene. The backdrop shows rows of traditional yellow-walled houses with tiled roofs, colorful lanterns hanging and glowing warmly, reflecting on the Thu Bon River. Small boats can be seen floating on the water, adding authenticity to the scene. The atmosphere is vibrant yet nostalgic, filled with the charm of a UNESCO World Heritage site. Shot from an eye-level angle, illuminated by lantern lights, the photo style is clean and crisp, typical of travel and cultural photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16." },
  { label: "Khung thêu", maleText: "A hyper-detailed, close-up macro photograph of hand embroidery in progress on white textured linen, stretched tightly within a polished wooden hoop. At the center, a highly realistic stitched portrait based on the uploaded image, with orange, brown, and blue threads forming lifelike depth and texture. To the side, a soft-focus tangle of floss in matching colors adds to the active workspace.\n\nA pair of slender masculine hands enters the frame: one hand gently steadies the hoop, while the other gracefully guides a fine embroidery needle. The needle is threaded with the same color floss currently being stitched in the portrait, and a small spool of matching thread rests naturally on the hoop, reinforcing the continuity of the process.\n\nBelow the portrait, the name “Memory” is embroidered in bold orange letters, clean and glossy. To the right, small unfinished green geometric stitches add authenticity. Sunlight highlights the fibers and skin, casting warm shadows that emphasize the tactile, photorealistic atmosphere of handmade craftsmanship in action.", femaleText: "A hyper-detailed, close-up macro photograph of hand embroidery in progress on white textured linen, stretched tightly within a polished wooden hoop. At the center, a highly realistic stitched portrait based on the uploaded image, with orange, brown, and blue threads forming lifelike depth and texture. To the side, a soft-focus tangle of floss in matching colors adds to the active workspace.\n\nA pair of delicate feminine hands enters the frame: one hand gently steadies the hoop, while the other gracefully guides a fine embroidery needle. The needle is threaded with the same color floss currently being stitched in the portrait, and a small spool of matching thread rests naturally on the hoop, reinforcing the continuity of the process.\n\nBelow the portrait, the name “Memory” is embroidered in bold orange letters, clean and glossy. To the right, small unfinished green geometric stitches add authenticity. Sunlight highlights the fibers and skin, casting warm shadows that emphasize the tactile, photorealistic atmosphere of handmade craftsmanship in action." },
  { label: "Lái xe", maleText: "A cinematic portrait of a young man (use upload photo) sitting in a vintage car, surrounded by a blooming field of golden-yellow flowers at sunset. The warm golden hour lighting casts soft highlights on his skin, creating a natural, glowing look. He wears a simple white sleeveless top, blending effortlessly with the retro yet modern vibe. framed by slightly tousled shoulder-length black hair with soft waves. The atmosphere is nostalgic, romantic, and cinematic, evoking the feeling of late summer evenings. Keep all details exactly the same, only replace the face with the one from the upload image", femaleText: "A cinematic portrait of a young woman (use upload photo) sitting in a vintage car, surrounded by a blooming field of golden-yellow flowers at sunset. The warm golden hour lighting casts soft highlights on her skin, creating a natural, glowing look. She wears a simple white sleeveless top, blending effortlessly with the retro yet modern vibe. framed by slightly tousled shoulder-length black hair with soft waves. The atmosphere is nostalgic, romantic, and cinematic, evoking the feeling of late summer evenings. Keep all details exactly the same, only replace the face with the one from the upload image" },
  { label: "Du lịch làng nghề", maleText: "", femaleText: "A high-fashion portrait of a young woman sitting gracefully in front of a vibrant incense village backdrop, with rows of colorful incense sticks arranged in fan shapes (red, orange, yellow, and green). She is wearing a flowing white pleated dress with thin straps, exuding elegance and modern style. On her head is a traditional Vietnamese conical hat with purple straps, blending tradition and fashion. She sits on a bamboo chair, resting her hand on his face in a poised, stylish manner. The atmosphere is artistic and cultural, with warm natural light highlighting the vivid colors of the incense. Keep everything exactly the same, only replace the face with the one from the uploaded photo, preserving all natural features and expressions." },
  { label: "Quý tộc", maleText: "A 30-year-young man, pose and framing like the reference: seated in the driver’s seat of a classic black car during a nighttime snowfall at the Eiffel Tower . The open door frames him as snow flurries swirl through the cabin; frost rims the window glass; visible breath in the cold air. One foot presses into powder‑dusted asphalt. He leans forward slightly, calm and confident, looking straight into the lens. Shot from a dramatic low angle; crisp facial detail with swirling snow in cinematic depth; cool blue palette, soft white highlights, gentle fill from snow bounce. He is wearing a classic wool overcoat, a charcoal turtleneck, leather gloves, lace‑up brogue boots. Shot on a Canon EOS R5 with a 35mm f/1.4 lens, fine film grain, desaturated cold‑grade look with soft contrast, subtle bloom on snow highlights, drifting snow layers, premium winter editorial mood, vertical 9:16 aspect ratio", femaleText: "A 30-year-young woman, pose and framing like the reference: seated in the driver’s seat of a classic black car during a nighttime snowfall at the Eiffel Tower. The open door frames her as snow flurries swirl through the cabin; frost rims the window glass; visible breath in the cold air. One foot presses into powder‑dusted asphalt. She leans forward slightly, calm and confident, looking straight into the lens. Shot from a dramatic low angle; crisp facial detail with swirling snow in cinematic depth; cool blue palette, soft white highlights, gentle fill from snow bounce. She is wearing a classic wool overcoat, a charcoal turtleneck, leather gloves, lace‑up brogue boots. Shot on a Canon EOS R5 with a 35mm f/1.4 lens, fine film grain, desaturated cold‑grade look with soft contrast, subtle bloom on snow highlights, drifting snow layers, premium winter editorial mood, vertical 9:16 aspect ratio" },
  { label: "Chủ thể nằm", maleText: "A dreamy portrait of a handsome man lying gracefully beside white lilies, his head resting gently on his arms, reflected perfectly on a glossy black surface. Soft cinematic lighting highlights his glowing skin and delicate facial features, with wet strands of hair framing his face. The mood is ethereal, romantic, and artistic, with a serene atmosphere, ultra realistic, high detail, professional studio photography, 8K", femaleText: "A dreamy portrait of a beautiful woman lying gracefully beside white lilies, her head resting gently on his arms, reflected perfectly on a glossy black surface. Soft cinematic lighting highlights her glowing skin and delicate facial features, with wet strands of hair framing her face. The mood is ethereal, romantic, and artistic, with a serene atmosphere, ultra realistic, high detail, professional studio photography, 8K" },
  { label: "Năm mới", maleText: "Portrait of a young man in modern traditional attire. He sits gracefully on a wooden chair, holding a red folding fan in his hands. He wears a silk tunic with classic floral patterns, paired with flowing bright red trousers. His dark hair is neatly styled, and his refined face retains the same gentle expression as the reference photo.\n\nThe background is set in a traditional Lunar New Year atmosphere, featuring a large vase of red peach blossoms, classic decorative paintings, and a few ornamental red carp figures. The scene is lit with soft studio lighting, in the style of festive New Year artistic photography. Ultra-detailed, 8K quality, realistic and vibrant.", femaleText: "Portrait of a young woman in modern traditional attire. She sits gracefully on a wooden chair, holding a red folding fan in her hands. She wears a silk halter top with classic floral patterns, paired with a flowing bright red skirt. Her long black hair is braided neatly, and her delicate face retains the same gentle expression as the reference photo.\n\nThe background is set in a traditional Lunar New Year atmosphere, featuring a large vase of red peach blossoms, classic decorative paintings, and a few ornamental red carp figures. The scene is lit with soft studio lighting, in the style of festive New Year artistic photography. Ultra-detailed, 8K quality, realistic and vibrant." },
  { label: "Ngồi máy bay", maleText: "Create an AI-generated image of the uploaded man, keeping his original facial features 100% identical. He is sitting in the luxurious Conference Suite of a Bombardier Global 7500 private jet flying in the sky. He is holding the brand-new iPhone 17 Pro Max in orange, checking his work. His legs are crossed elegantly. On the table in front of him is a glass of wine and a premium breakfast set. The atmosphere is stylish, modern, and high-class.", femaleText: "Create an AI-generated image of the uploaded woman, keeping her original facial features 100% identical. She is sitting in the luxurious Conference Suite of a Bombardier Global 7500 private jet flying in the sky. She is holding the brand-new iPhone 17 Pro Max in orange, checking her work. Her legs are crossed elegantly. On the table in front of her is a glass of wine and a premium breakfast set. The atmosphere is stylish, modern, and high-class." },
  { label: "Doanh nhân", maleText: "A professional corporate portrait of a confident man standing in a modern office hallway with large glass windows and natural sunlight streaming in. He is wearing an elegant cream-white tailored suit with a blazer and trousers, holding an iPad in front of him. The atmosphere is powerful, modern, and stylish, highlighting a successful businessman. Keep the outfit, body pose, and background exactly the same — only replace the face with the one from the uploaded photo, preserving natural features, expression, and realism. High-resolution, sharp, cinematic lighting.", femaleText: "A professional corporate portrait of a confident woman standing in a modern office hallway with large glass windows and natural sunlight streaming in. She is wearing an elegant cream-white tailored suit with a blazer and trousers, holding an iPad in front of her. The atmosphere is powerful, modern, and stylish, highlighting a successful businesswoman. Keep the outfit, body pose, and background exactly the same — only replace the face with the one from the uploaded photo, preserving natural features, expression, and realism. High-resolution, sharp, cinematic lighting." },
  { label: "Lái xe 2", maleText: "A man (use upload photo) driving a modern convertible sports car at night through a city brightly lit with neon signs. The reflections of the city lights are visible on the car's sleek surface and his sunglasses. The mood is cool, confident, and energetic. Cinematic, vibrant colors, motion blur in the background.", femaleText: "A woman (use upload photo) driving a vintage convertible along a scenic coastal highway during the day. Her hair is blowing in the wind, and she has a joyful, carefree expression. The sun is shining, and the ocean is sparkling in the background. The mood is adventurous and free-spirited. Travel photography style, high detail." },
  { label: "Bên tượng nữ thần", maleText: "A man (use upload photo) poses on a ferry with the Statue of Liberty clearly visible in the background against a bright blue sky. He is wearing casual travel clothes like a jacket and jeans, and has a happy, touristy expression. The photo style is a classic, vibrant travel snapshot. Ultra-realistic 8K high resolution. Aspect ratio 9:16.", femaleText: "A woman (use upload photo) poses on Liberty Island with the Statue of Liberty towering behind her. The sky is a beautiful blue with a few fluffy clouds. She is wearing a stylish dress suitable for a day of sightseeing. She is smiling brightly at the camera. The photo style is a clean, crisp, modern travel photo. Ultra-realistic 8K high resolution. Aspect ratio 9:16." }
];

const PROMPTS_STORAGE_KEY = 'gemini-image-editor-prompts';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditPromptsModal, setShowEditPromptsModal] = useState(false);
  const [showSavePromptModal, setShowSavePromptModal] = useState(false);
  
  const [prompts, setPrompts] = useState<Prompt[]>(() => {
    try {
      const savedPrompts = localStorage.getItem(PROMPTS_STORAGE_KEY);
      if (savedPrompts !== null) {
        const parsed = JSON.parse(savedPrompts);
        if (Array.isArray(parsed) && (parsed.length === 0 || (typeof parsed[0] === 'object' && 'label' in parsed[0] && 'maleText' in parsed[0] && 'femaleText' in parsed[0]))) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load prompts from localStorage", e);
    }
    // If nothing in localStorage, or data is malformed, initialize with defaults
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(defaultPrompts));
    return defaultPrompts;
  });

  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  useEffect(() => {
    // This effect ensures that on first load, if localStorage is empty, it gets populated.
    // The useState initializer already handles the logic, but this is a fallback.
    try {
      const savedPrompts = localStorage.getItem(PROMPTS_STORAGE_KEY);
      if (savedPrompts === null || JSON.parse(savedPrompts).length === 0) {
        localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(defaultPrompts));
        setPrompts(defaultPrompts);
      }
    } catch (e) {
      console.error("Failed to initialize prompts in localStorage", e);
    }
  }, []);

  const handleImageUpload = useCallback((imageFile: ImageFile | null) => {
    setOriginalImage(imageFile);
    setEditedImage(null);
    setError(null);
  }, []);

  const handleLogin = useCallback((user: string, pass: string) => {
    if (user === 'admin' && pass === 'Hd543211') {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const handleSavePrompts = useCallback((newPrompts: Prompt[]) => {
    try {
        setPrompts(newPrompts);
        localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(newPrompts));
        setShowEditPromptsModal(false);
    } catch (e) {
        console.error("Failed to save prompts to localStorage", e);
        setError("Không thể lưu các prompt. Bộ nhớ cục bộ của trình duyệt có thể đã đầy hoặc bị vô hiệu hóa.");
    }
  }, []);
  
  const handleAddUserPrompt = useCallback((newPrompt: Prompt) => {
    try {
        const updatedPrompts = [...prompts, newPrompt];
        setPrompts(updatedPrompts);
        localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(updatedPrompts));
        setShowSavePromptModal(false);
    } catch (e) {
        console.error("Failed to save prompts to localStorage", e);
        setError("Không thể lưu các prompt. Bộ nhớ cục bộ của trình duyệt có thể đã đầy hoặc bị vô hiệu hóa.");
    }
  }, [prompts]);

  const handlePromptSelect = useCallback((selectedPrompt: Prompt) => {
    const newPromptText = gender === 'male' ? selectedPrompt.maleText : selectedPrompt.femaleText;
    setPrompt(newPromptText);
  }, [gender]);

  const handleGenderChange = useCallback((newGender: 'male' | 'female') => {
    setGender(newGender);
    if (prompt) {
        const currentPromptObject = prompts.find(p => p.maleText === prompt || p.femaleText === prompt);
        if (currentPromptObject) {
            const newPromptText = newGender === 'male' ? currentPromptObject.maleText : currentPromptObject.femaleText;
            setPrompt(newPromptText);
        }
    }
  }, [prompt, prompts]);


  const handleSubmit = useCallback(async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Vui lòng tải lên hình ảnh và chọn một prompt chỉnh sửa.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const result = await editImageWithPrompt(originalImage.base64, originalImage.mimeType, prompt);
      if (result) {
        setEditedImage(result);
      } else {
        setError('Tạo ảnh thất bại. Model có thể không trả về hình ảnh cho prompt này.');
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không mong muốn.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header
        isLoggedIn={isLoggedIn}
        onShowLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onShowEditPrompts={() => setShowEditPromptsModal(true)}
      />
      
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
      {isLoggedIn && showEditPromptsModal && <EditPromptsModal prompts={prompts} onSave={handleSavePrompts} onClose={() => setShowEditPromptsModal(false)} />}
      {isLoggedIn && showSavePromptModal && <SavePromptModal currentPrompt="" onSave={handleAddUserPrompt} onClose={() => setShowSavePromptModal(false)} />}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Control Panel */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6 h-full">
            <h2 className="text-xl font-bold text-indigo-400">1. Tải ảnh lên</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-indigo-400">2. Chọn kiểu chỉnh sửa</h2>
                {isLoggedIn && (
                  <button
                      onClick={() => setShowSavePromptModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg transition-colors text-sm"
                      title="Thêm prompt mới của riêng bạn"
                  >
                      + Thêm Mới
                  </button>
                )}
            </div>
            
            <div className="flex items-center gap-2 bg-gray-700/50 p-1 rounded-lg">
                <button
                    onClick={() => handleGenderChange('male')}
                    className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-300 ${
                        gender === 'male' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Nam
                </button>
                <button
                    onClick={() => handleGenderChange('female')}
                    className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-300 ${
                        gender === 'female' ? 'bg-pink-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Nữ
                </button>
            </div>

            <PromptSelector
              prompts={prompts}
              onPromptSelect={handlePromptSelect}
              selectedPrompt={prompt}
              disabled={isLoading}
              gender={gender}
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading || !originalImage || !prompt}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Tạo Ảnh Chỉnh Sửa
                </>
              )}
            </button>
            {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
          </div>

          {/* Image Display */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 h-full">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Kết quả</h2>
            <ImageDisplay 
              originalImage={originalImage} 
              editedImage={editedImage}
              isLoading={isLoading} 
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Cung cấp bởi Gemini AI. Xây dựng bởi Nguyễn Văn Duy, Kỹ sư Phần mềm Cao cấp.</p>
      </footer>
    </div>
  );
};

export default App;