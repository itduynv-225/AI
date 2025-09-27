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
  { label: "Cà Phê 1", maleText: "Use this photo for A warm, cozy lifestyle moment of a young man relaxing at a sunny outdoor café. He wears a comfortable cream sweater, light blue cropped jeans, and white ankle boots. His hair is tied back in a relaxed low bun, with stylish simple necklace completing the look. He's sipping coffee while reading a book, sitting on a wicker café chair at a small round table with a glass of water.", femaleText: "Use this photo for A warm, cozy lifestyle moment of a young woman relaxing at a sunny outdoor café. She wears a comfortable cream sweater, light blue cropped jeans, and white ankle boots. Her hair is tied back in a relaxed low bun, with stylish simple necklace completing the look. She's sipping coffee while reading a book, sitting on a wicker café chair at a small round table with a glass of water." },
  { label: "Cà Phê 2", maleText: "", femaleText: "A slim young woman (use upload photo) with fair, radiant skin is sitting elegantly at a Parisian outdoor café table. She is wearing a chic white beret, oversized black sunglasses, a fitted white blazer, and sheer floral embroidered tights in pastel pink and green, paired with pointed-toe white high heels. A quilted black leather designer handbag with a gold chain rests on the table. She gracefully holds a white porcelain teacup with one hand, her other hand touching her face in a poised gesture. Behind her is the classic Haussmann-style Parisian architecture with cream-colored stone buildings, wrought-iron balconies, and large windows. Green plants in black planters add a touch of freshness to the setting. The framing should match the reference photo: full-body seated pose, slightly angled perspective, with natural daylight creating a sophisticated and luxurious Parisian café scene. Keep everything exactly the same — outfit, accessories, background, and composition — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. Ultra high resolution, cinematic, photorealistic quality." },
  { label: "Ga tàu", maleText: "A slim young man (use upload photo) with fair, radiant skin is sitting elegantly on a metal bench at a European train station platform, in front of the "Los Angeles Station" signboard and timetable boards in the background. He is dressed in a beige tailored suit with a relaxed fit, a plain white t-shirt inside, and white Converse sneakers. A black leather shoulder bag rests casually on his side, and he is holding a takeaway coffee cup with both hands, gazing thoughtfully ahead. His long, dark, wavy hair flows naturally, complementing his chic and modern look. The environment shows train tracks, blurred commuters, and the architectural details of the station's glass roof and steel structure. Framing should match the reference image: a three-quarter body shot, seated position, slightly side-facing angle, with soft natural daylight. Keep everything exactly the same — outfit, accessories, background, lighting, and composition — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. High resolution, photorealistic, cinematic quality.", femaleText: "A slim young woman (use upload photo) with fair, radiant skin is sitting elegantly on a metal bench at a European train station platform, in front of the "Los Angeles Station" signboard and timetable boards in the background. She is dressed in a beige tailored suit with a relaxed fit, a plain white t-shirt inside, and white Converse sneakers. A black leather shoulder bag rests casually on his side, and she is holding a takeaway coffee cup with both hands, gazing thoughtfully ahead. Her long, dark, wavy hair flows naturally, complementing her chic and modern look. The environment shows train tracks, blurred commuters, and the architectural details of the station's glass roof and steel structure. Framing should match the reference image: a three-quarter body shot, seated position, slightly side-facing angle, with soft natural daylight. Keep everything exactly the same — outfit, accessories, background, lighting, and composition — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. High resolution, photorealistic, cinematic quality." },
  { label: "CEO", maleText: "Đây là một bức ảnh chụp độ phân giải cao của một người đàn ông châu Á, khoảng cuối tuổi 30 đến đầu 40, đang ngồi tại một chiếc bàn chủ tịch lớn. Anh có làn da sáng, mái tóc đen ngắn , đeo kính gọng mảnh trong suốt với chi tiết bạc tinh tế ở phần gọng. Trang phục của anh mang phong cách trang trọng và quyền lực: bộ vest xanh navy may đo vừa vặn, áo sơ mi trắng tinh khôi và cà vạt lụa cao cấp. Anh đeo thêm đồng hồ sang trọng và ghim áo bạc nhỏ tinh tế. Chiếc bàn chủ tịch làm bằng gỗ tối màu bóng loáng, bề mặt hiện đại và sang trọng. Trên bàn có tài liệu được sắp xếp gọn gàng, một cây bút máy cao cấp, và một chiếc laptop bạc đang mở. Ngoài ra còn có một tập hồ sơ bọc da và một tạp chí thương hiệu, tạo cảm giác chuyên nghiệp và uy tín. Phông nền là bức tường màu xám sáng, làm nổi bật nhân vật và không gian văn phòng. Chiếc ghế anh ngồi là ghế da cao cấp, lưng cao, thể hiện sự quyền lực và tinh tế. Tổng thể bức ảnh mang tính quyền lực, sang trọng và hiện đại, nhấn mạnh thần thái của một vị chủ tịch trong môi trường doanh nghiệp đẳng cấp. Lưu ý: giữ nguyên khuôn mặt, kiểu tóc từ ảnh gốc đã tải lên.", femaleText: "Đây là một bức ảnh chụp độ phân giải cao của một người phụ nữ châu Á, khoảng cuối tuổi 30 đến đầu 40, đang ngồi tại một chiếc bàn chủ tịch lớn. Cô có làn da sáng, đeo kính gọng mảnh trong suốt với chi tiết bạc tinh tế ở phần gọng. Trang phục của cô mang phong cách trang trọng và quyền lực: bộ vest xanh navy may đo vừa vặn, áo sơ mi trắng tinh khôi và khăn lụa cao cấp. Cô đeo thêm đồng hồ sang trọng và ghim áo bạc nhỏ tinh tế. Chiếc bàn chủ tịch làm bằng gỗ tối màu bóng loáng, bề mặt hiện đại và sang trọng. Trên bàn có tài liệu được sắp xếp gọn gàng, một cây bút máy cao cấp, và một chiếc laptop bạc đang mở. Ngoài ra còn có một tập hồ sơ bọc da và một tạp chí thương hiệu, tạo cảm giác chuyên nghiệp và uy tín. Phông nền là bức tường màu xám sáng, làm nổi bật nhân vật và không gian văn phòng. Chiếc ghế cô ngồi là ghế da cao cấp, lưng cao, thể hiện sự quyền lực và tinh tế. Tổng thể bức ảnh mang tính quyền lực, sang trọng và hiện đại, nhấn mạnh thần thái của một nữ chủ tịch trong môi trường doanh nghiệp đẳng cấp. Lưu ý: giữ nguyên khuôn mặt, kiểu tóc từ ảnh gốc đã tải lên." },
  { label: "Nhiếp ảnh", maleText: "A stylish Vietnam man (use upload photo) sitting casually on the roadside in the city, holding a vintage camera, wearing a chic black blazer with slim-fit trousers, white socks and black loafers, paired with a brown leather shoulder bag, captured in warm vintage film tones, soft grain, slightly faded colors, nostalgic and cinematic mood, golden hour sunlight, retro street fashion photography", femaleText: "A stylish Vietnam woman (use upload photo) sitting casually on the roadside in the city, holding a vintage camera, wearing a chic black blazer with a mini skirt, white socks and black loafers, paired with a brown leather shoulder bag, captured in warm vintage film tones, soft grain, slightly faded colors, nostalgic and cinematic mood, golden hour sunlight, retro street fashion photography" },
  { label: "Cổ trang", maleText: "A stunning young man in traditional Chinese Hanfu, wearing a flowing pastel peach and cream embroidered robe with golden floral patterns. He holds an elegant Chinese round fan in his hand. His hair is styled in an elaborate Tang dynasty-inspired updo with ornate floral headpieces, tassels, and pearl accessories. Keep the face and expression from the uploaded photo. He stands gracefully in front of a a traditional Chinese window with carved wooden details, bathed in soft natural light with gentle shadows. The atmosphere is elegant, cinematic, and reminiscent of classical Chinese male beauty portraits.", femaleText: "A stunning young woman in traditional Chinese Hanfu, wearing a flowing pastel peach and cream embroidered robe with golden floral patterns. She holds an elegant Chinese round fan in her hand. Her hair is styled in an elaborate Tang dynasty-inspired updo with ornate floral headpieces, tassels, and pearl accessories. Keep the face and expression from the uploaded photo. She stands gracefully in front of a traditional Chinese window with carved wooden details, bathed in soft natural light with gentle shadows. The atmosphere is elegant, cinematic, and reminiscent of classical Chinese beauty portraits." },
  { label: "Doreamon", maleText: "A hyper-realistic nostalgic 1990s Vietnamese photo of me in the photo I uploaded, sitting on the patterned cement-tile floor of an old family living room, facing a retro CRT box TV. I wear a plain white T-shirt and simple black shorts, with plastic sandals. While sitting and watching TV, I turn my head back slightly toward the camera, looking directly at the lens with a very subtle, tiny smile. Beside me sit two life-sized characters: Doraemon and Nobita, both real, alive, cheerful, and natural, like childhood friends brought into reality. On the old CRT TV screen in front of me, the classic Doraemon anime is playing, clearly showing Doraemon and Nobita inside the screen. The room has vintage cement tiles, pale green or yellow painted walls, a wall calendar, and a standing fan in the corner, all lit with warm golden lighting. The atmosphere feels cozy, nostalgic, and cinematic, recreating the vibe of a typical Vietnamese home in the 1990s.", femaleText: "A hyper-realistic nostalgic 1990s Vietnamese photo of me in the photo I uploaded, sitting on the patterned cement-tile floor of an old family living room, facing a retro CRT box TV. I wear a plain white T-shirt and simple black shorts, with plastic sandals. While sitting and watching TV, I turn my head back slightly toward the camera, looking directly at the lens with a very subtle, tiny smile. Beside me sit two life-sized characters: Doraemon and Nobita, both real, alive, cheerful, and natural, like childhood friends brought into reality. On the old CRT TV screen in front of me, the classic Doraemon anime is playing, clearly showing Doraemon and Nobita inside the screen. The room has vintage cement tiles, pale green or yellow painted walls, a wall calendar, and a standing fan in the corner, all lit with warm golden lighting. The atmosphere feels cozy, nostalgic, and cinematic, recreating the vibe of a typical Vietnamese home in the 1990s." },
  { label: "Dù lượn Dubai", maleText: "Ultra-realistic wide-angle selfie photo of a person (attached photo) skydiving high above the Palm Jumeirah, Dubai. The subject wears a black jumpsuit with secure parachute harness and transparent protective goggles. Their hair is blown upward by the wind, expression joyful and excited. The parachute straps and lines are visible above him. Below, the iconic artificial palm-shaped island is clearly seen surrounded by turquoise waters and white sandy edges.", femaleText: "Ultra-realistic wide-angle selfie photo of a person (attached photo) skydiving high above the Palm Jumeirah, Dubai. The subject wears a black jumpsuit with secure parachute harness and transparent protective goggles. Their hair is blown upward by the wind, expression joyful and excited. The parachute straps and lines are visible above him. Below, the iconic artificial palm-shaped island is clearly seen surrounded by turquoise waters and white sandy edges." },
  { label: "Du Lịch Fansipan", maleText: "a man poses at the Fansipan summit in Sapa, Lao Cai, Vietnam. use upload photo, adjust the subject's scale naturally to fit the majestic mountain landscape. The backdrop shows the iconic Fansipan peak with its triangular summit marker, surrounded by clouds floating below and the vast Hoang Lien Son mountain range stretching into the distance. Colorful prayer flags and the grand Fansipan pagoda complex can be seen nearby, adding authenticity to the scene. The atmosphere is inspiring and adventurous, captured in bright natural daylight above the clouds. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16.", femaleText: "a women poses at the Fansipan summit in Sapa, Lao Cai, Vietnam. use upload photo, adjust the subject's scale naturally to fit the majestic mountain landscape. The backdrop shows the iconic Fansipan peak with its triangular summit marker, surrounded by clouds floating below and the vast Hoang Lien Son mountain range stretching into the distance. Colorful prayer flags and the grand Fansipan pagoda complex can be seen nearby, adding authenticity to the scene. The atmosphere is inspiring and adventurous, captured in bright natural daylight above the clouds. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16." },
  { label: "Trang phục Hàn", maleText: `A full-body portrait of a young man (use upload photo) wearing a traditional Korean hanbok, standing gracefully under blooming cherry blossom trees in spring. The hanbok consists of a delicate white jeogori (short jacket) paired with flowing baji (trousers) in gradient shades of soft blue, soft layers creating a dreamy and elegant look. He holds a tassel ornament at his waist, and his hair is styled in an elegant topknot adorned with subtle hair ornaments. He gazes slightly to the side with a serene and graceful expression, surrounded by branches of cherry blossoms in full bloom. The background shows lush green trees with sunlight filtering through, creating a soft and romantic spring atmosphere. Cinematic, ultra-realistic style with vivid details. IMPORTANT: Preserve the exact face, identity, and expression from the uploaded reference photo without any changes. The face is the highest priority and must match the uploaded image perfectly.",
  "style": "Cinematic, ultra-realistic photography, traditional Korean aesthetic, detailed textures",
  "lighting": "Soft natural daylight, warm highlights, gentle shadows, glowing spring light",
  "mood": "Romantic, serene, cultural, elegant",
  "camera": {
    "shot": "Full body, slightly angled but face visible, eye-level perspective",
    "focus": "Strong focus on subject's face from the uploaded photo (priority), background softly blurred",
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
    "focus": "Strong focus on subject's face from the uploaded photo (priority), background softly blurred",
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
  { label: "Khung thêu", maleText: "A hyper-detailed, close-up macro photograph of hand embroidery in progress on white textured linen, stretched tightly within a polished wooden hoop. At the center, a highly realistic stitched portrait based on the uploaded image, with orange, brown, and blue threads forming lifelike depth and texture. To the side, a soft-focus tangle of floss in matching colors adds to the active workspace.\n\nA pair of slender masculine hands enters the frame: one hand gently steadies the hoop, while the other gracefully guides a fine embroidery needle. The needle is threaded with the same color floss currently being stitched in the portrait, and a small spool of matching thread rests naturally on the hoop, reinforcing the continuity of the process.\n\nBelow the portrait, the name "{Tên thêu}" is embroidered in bold orange letters, clean and glossy. To the right, small unfinished green geometric stitches add authenticity. Sunlight highlights the fibers and skin, casting warm shadows that emphasize the tactile, photorealistic atmosphere of handmade craftsmanship in action.", femaleText: "A hyper-detailed, close-up macro photograph of hand embroidery in progress on white textured linen, stretched tightly within a polished wooden hoop. At the center, a highly realistic stitched portrait based on the uploaded image, with orange, brown, and blue threads forming lifelike depth and texture. To the side, a soft-focus tangle of floss in matching colors adds to the active workspace.\n\nA pair of delicate feminine hands enters the frame: one hand gently steadies the hoop, while the other gracefully guides a fine embroidery needle. The needle is threaded with the same color floss currently being stitched in the portrait, and a small spool of matching thread rests naturally on the hoop, reinforcing the continuity of the process.\n\nBelow the portrait, the name "{Tên thêu}" is embroidered in bold orange letters, clean and glossy. To the right, small unfinished green geometric stitches add authenticity. Sunlight highlights the fibers and skin, casting warm shadows that emphasize the tactile, photorealistic atmosphere of handmade craftsmanship in action." },
  { label: "Lái xe", maleText: "A cinematic portrait of a young man (use upload photo) sitting in a vintage car, surrounded by a blooming field of golden-yellow flowers at sunset. The warm golden hour lighting casts soft highlights on his skin, creating a natural, glowing look. He wears a simple white sleeveless top, blending effortlessly with the retro yet modern vibe. framed by slightly tousled shoulder-length black hair with soft waves. The atmosphere is nostalgic, romantic, and cinematic, evoking the feeling of late summer evenings. Keep all details exactly the same, only replace the face with the one from the upload image", femaleText: "A cinematic portrait of a young woman (use upload photo) sitting in a vintage car, surrounded by a blooming field of golden-yellow flowers at sunset. The warm golden hour lighting casts soft highlights on her skin, creating a natural, glowing look. She wears a simple white sleeveless top, blending effortlessly with the retro yet modern vibe. framed by slightly tousled shoulder-length black hair with soft waves. The atmosphere is nostalgic, romantic, and cinematic, evoking the feeling of late summer evenings. Keep all details exactly the same, only replace the face with the one from the upload image" },
  { label: "Du lịch làng nghề", maleText: "", femaleText: "A high-fashion portrait of a young woman sitting gracefully in front of a vibrant incense village backdrop, with rows of colorful incense sticks arranged in fan shapes (red, orange, yellow, and green). She is wearing a flowing white pleated dress with thin straps, exuding elegance and modern style. On her head is a traditional Vietnamese conical hat with purple straps, blending tradition and fashion. She sits on a bamboo chair, resting her hand on his face in a poised, stylish manner. The atmosphere is artistic and cultural, with warm natural light highlighting the vivid colors of the incense. Keep everything exactly the same, only replace the face with the one from the uploaded photo, preserving all natural features and expressions." },
  { label: "Quý tộc", maleText: "A 30-year-young man, pose and framing like the reference: seated in the driver's seat of a classic black car during a nighttime snowfall at the Eiffel Tower . The open door frames him as snow flurries swirl through the cabin; frost rims the window glass; visible breath in the cold air. One foot presses into powder‑dusted asphalt. He leans forward slightly, calm and confident, looking straight into the lens. Shot from a dramatic low angle; crisp facial detail with swirling snow in cinematic depth; cool blue palette, soft white highlights, gentle fill from snow bounce. He is wearing a classic wool overcoat, a charcoal turtleneck, leather gloves, lace‑up brogue boots. Shot on a Canon EOS R5 with a 35mm f/1.4 lens, fine film grain, desaturated cold‑grade look with soft contrast, subtle bloom on snow highlights, drifting snow layers, premium winter editorial mood, vertical 9:16 aspect ratio", femaleText: "A 30-year-young woman, pose and framing like the reference: seated in the driver's seat of a classic black car during a nighttime snowfall at the Eiffel Tower. The open door frames her as snow flurries swirl through the cabin; frost rims the window glass; visible breath in the cold air. One foot presses into powder‑dusted asphalt. She leans forward slightly, calm and confident, looking straight into the lens. Shot from a dramatic low angle; crisp facial detail with swirling snow in cinematic depth; cool blue palette, soft white highlights, gentle fill from snow bounce. She is wearing a classic wool overcoat, a charcoal turtleneck, leather gloves, lace‑up brogue boots. Shot on a Canon EOS R5 with a 35mm f/1.4 lens, fine film grain, desaturated cold‑grade look with soft contrast, subtle bloom on snow highlights, drifting snow layers, premium winter editorial mood, vertical 9:16 aspect ratio" },
  { label: "Chủ thể nằm", maleText: "A dreamy portrait of a handsome man lying gracefully beside white lilies, his head resting gently on his arms, reflected perfectly on a glossy black surface. Soft cinematic lighting highlights his glowing skin and delicate facial features, with wet strands of hair framing his face. The mood is ethereal, romantic, and artistic, with a serene atmosphere, ultra realistic, high detail, professional studio photography, 8K", femaleText: "A dreamy portrait of a beautiful woman lying gracefully beside white lilies, her head resting gently on his arms, reflected perfectly on a glossy black surface. Soft cinematic lighting highlights her glowing skin and delicate facial features, with wet strands of hair framing her face. The mood is ethereal, romantic, and artistic, with a serene atmosphere, ultra realistic, high detail, professional studio photography, 8K" },
  { label: "Năm mới", maleText: "Portrait of a young man in modern traditional attire. He sits gracefully on a wooden chair, holding a red folding fan in his hands. He wears a silk tunic with classic floral patterns, paired with flowing bright red trousers. His dark hair is neatly styled, and his refined face retains the same gentle expression as the reference photo.\n\nThe background is set in a traditional Lunar New Year atmosphere, featuring a large vase of red peach blossoms, classic decorative paintings, and a few ornamental red carp figures. The scene is lit with soft studio lighting, in the style of festive New Year artistic photography. Ultra-detailed, 8K quality, realistic and vibrant.", femaleText: "Portrait of a young woman in modern traditional attire. She sits gracefully on a wooden chair, holding a red folding fan in her hands. She wears a silk halter top with classic floral patterns, paired with a flowing bright red skirt. Her long black hair is braided neatly, and her delicate face retains the same gentle expression as the reference photo.\n\nThe background is set in a traditional Lunar New Year atmosphere, featuring a large vase of red peach blossoms, classic decorative paintings, and a few ornamental red carp figures. The scene is lit with soft studio lighting, in the style of festive New Year artistic photography. Ultra-detailed, 8K quality, realistic and vibrant." },
  { label: "Ngồi máy bay", maleText: "Create an AI-generated image of the uploaded man, keeping his original facial features 100% identical. He is sitting in the luxurious Conference Suite of a Bombardier Global 7500 private jet flying in the sky. He is holding the brand-new iPhone 17 Pro Max in orange, checking his work. His legs are crossed elegantly. On the table in front of him is a glass of wine and a premium breakfast set. The atmosphere is stylish, modern, and high-class.", femaleText: "Create an AI-generated image of the uploaded woman, keeping her original facial features 100% identical. She is sitting in the luxurious Conference Suite of a Bombardier Global 7500 private jet flying in the sky. She is holding the brand-new iPhone 17 Pro Max in orange, checking her work. Her legs are crossed elegantly. On the table in front of her is a glass of wine and a premium breakfast set. The atmosphere is stylish, modern, and high-class." },
  { label: "Doanh nhân", maleText: "A professional corporate portrait of a confident man standing in a modern office hallway with large glass windows and natural sunlight streaming in. He is wearing an elegant cream-white tailored suit with a blazer and trousers, holding an iPad in front of him. The atmosphere is powerful, modern, and stylish, highlighting a successful businessman. Keep the outfit, body pose, and background exactly the same — only replace the face with the one from the uploaded photo, preserving natural features, expression, and realism. High-resolution, sharp, cinematic lighting.", femaleText: "A professional corporate portrait of a confident woman standing in a modern office hallway with large glass windows and natural sunlight streaming in. She is wearing an elegant cream-white tailored suit with a blazer and trousers, holding an iPad in front of her. The atmosphere is powerful, modern, and stylish, highlighting a successful businesswoman. Keep the outfit, body pose, and background exactly the same — only replace the face with the one from the uploaded photo, preserving natural features, expression, and realism. High-resolution, sharp, cinematic lighting." },
  { label: "Lái xe 2", maleText: "Hyper-realistic shot from outside the Mercedes-Benz, looking in through the open driver's window. The man with eyeglasses sits confidently inside, wearing a fitted black suit and a black Apple Watch on his left wrist as he rests his arm on the door. The interior (wood trim, glossy buttons, glowing ambient LED strips, leather seats) is captured in sharp focus, while the reflections on the car's glossy exterior clearly show nearby city buildings, trees, and street details. Natural daylight enhances the cinematic realism", femaleText: "Based on the attached character photo (face locked), create a A young woman sitting confidently in the driver's seat of a luxury car with the door open. She has long, wavy brown hair, a radiant smile, and wears a chic teal pantsuit with black high heels. Sunglasses rest on top of her head. The interior of the car is elegant with brown leather seats and modern dashboard details. Background shows an urban city street with tall buildings and green trees. Style: ultra-realistic, modern fashion photography, sharp details, natural lighting. Aspect ratio 3:4." },
  { label: "Bên tượng nữ thần", maleText: "a man poses in front of the Statue of Liberty, New York City, USA. use upload photo, adjust the subject's scale naturally to fit the iconic landmark scene. The backdrop shows the Statue of Liberty standing tall on Liberty Island, with the pedestal and torch clearly visible, and the water of New York Harbor surrounding the island. The sky is blue with scattered clouds, natural daylight creates a bright and inspiring atmosphere. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16.", femaleText: "a women poses in front of the Statue of Liberty, New York City, USA. use upload photo, adjust the subject's scale naturally to fit the iconic landmark scene. The backdrop shows the Statue of Liberty standing tall on Liberty Island, with the pedestal and torch clearly visible, and the water of New York Harbor surrounding the island. The sky is blue with scattered clouds, natural daylight creates a bright and inspiring atmosphere. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16." },
  { label: "Phục hồi ảnh cũ", maleText: `"version": "1.0", 
  "task": "image_edit", 
  "notes": "Edit foto menjadi potret studio kelas profesional setara Canon EOS R5. Pertahankan wajah & pose asli.", 
  "input_image": "REPLACE_WITH_IMAGE_ID_OR_PATH", 
  "camera_emulation": { 
    "brand_model": "Canon EOS R5", 
    "lens": "50mm f/1.8 (standard prime, sedikit lebih luas dari 85mm)", 
    "look": "ultra sharp, rich micro-contrast, natural color science" 
  }, 
  "composition": { 
    "framing": "three-quarter body (from mid-thigh up)", 
    "arms": "both arms sepenuhnya terlihat", 
    "orientation": "portrait", 
    "crop_policy": "do_not_crop_face_or_hands", 
    "keep_pose": true, 
    "zoom": "slight zoom-out for wider context" 
  }, 
  "subject_constraints": { 
    "keep_identity": true, 
    "lock_features": ["eyes", "nose", "lips", "eyebrows", "jawline", "face_shape"], 
    "expression_policy": "preserve_original" 
  }, 
  "retouching": { 
    "skin": { 
      "tone": "keep original color", 
      "finish": "smooth, healthy, radiant", 
      "texture": "retain fine pores; avoid plastic look", 
      "blemishes": "lightly reduce temporary blemishes only", 
      "frequency_separation_strength": 0.4, 
      "clarity_microcontrast": 0.15 
    }, 
    "hair": { 
      "finish": "clean, neat, shiny", 
      "flyaways": "reduce but keep natural strands" 
    }, 
    "eyes": { 
      "whites_desaturation": 0.1, 
      "iris_clarity": 0.2, 
      "avoid_overwhitening": true 
    }, 
    "teeth": { 
      "natural_whiten": 0.08, 
      "avoid_pure_white": true 
  }, 
  "clothing": { 
    "policy": "upgrade quality while keeping same/similar style, cut, and color", 
    "fabric_look": "premium, fine weave, crisp edges", 
    "wrinkle_reduction": "moderate", 
    "texture_enhancement": 0.2 
  }, 
  "lighting": { 
    "setup": "bright, soft, even front light", 
    "key": "beauty dish or ring light straight-on", 
    "fill": "broad soft fill to remove harsh shadows", 
    "shadow_control": "minimal, no deep shadows", 
    "specular_highlights": "subtle, flattering", 
    "white_balance": "neutral daylight", 
    "exposure_target": "ETTR without clipping" 
  }, 
  "background": { 
    "type": "solid", 
    "color": "navy blue (#0f2a4a)", 
    "environment": "clean professional photo studio", 
    "gradient": "very subtle center vignette", 
    "separation": "gentle rim lift if needed" 
  }, 
  "color_tone": { 
    "overall": "natural, true-to-life skin tones", 
    "saturation": "moderate", 
    "contrast": "medium with soft roll-off", 
    "vibrance": 0.1 
  }, 
  "detail_sharpness": { 
    "method": "edge-aware sharpening", 
    "amount": 0.35, 
    "radius": 0.8, 
    "threshold": 0.02, 
    "noise_reduction": { 
      "luminance": 0.2, 
      "chroma": 0.25, 
      "preserve_details": 0.8 
  }, 
  "clean_up": { 
    "remove_noise": true, 
    "remove_artifacts": true, 
    "banding_fix_on_background": true 
  "output": { 
    "resolution": "6000x4000", 
    "dpi": 300, 
    "format": "PNG", 
    "color_space": "sRGB IEC61966-2.1", 
    "bit_depth": "16-bit if supported, else 8-bit", 
    "background_alpha": "opaque" 
  "safety_bounds": { 
    "do_not": [ 
      "change face geometry or identity", 
      "change pose", 
      "alter clothing style drastically", 
      "add heavy makeup", 
      "over-smooth or plastic skin", 
      "over-sharpen halos 
  "negative_prompt": [ 
    "plastic skin", 
    "over-whitened eyes/teeth", 
    "harsh shadows", 
    "color casts", 
    "halo artifacts", 
    "muddy blacks", 
    "posterization/banding", 
    "oversaturated skin", 
    "blotchy NR" 
    "face_identity_lock": 0.95, 
    "pose_lock": 0.95, 
    "background_replace_strength": 0.9, 
    "clothes_style_lock": 0.85 
  }, 
  "seed": 142857, 
  "metadata": { 
    "locale": "id-ID", 
    "creator": "professional photo editor style", 
    "purpose": "masterpiece studio portrait upgrade with zoom-out framing"`, femaleText: `"version": "1.0", 
  "task": "image_edit", 
  "notes": "Edit foto menjadi potret studio kelas profesional setara Canon EOS R5. Pertahankan wajah & pose asli.", 
  "input_image": "REPLACE_WITH_IMAGE_ID_OR_PATH", 
  "camera_emulation": { 
    "brand_model": "Canon EOS R5", 
    "lens": "50mm f/1.8 (standard prime, sedikit lebih luas dari 85mm)", 
    "look": "ultra sharp, rich micro-contrast, natural color science" 
  }, 
  "composition": { 
    "framing": "three-quarter body (from mid-thigh up)", 
    "arms": "both arms sepenuhnya terlihat", 
    "orientation": "portrait", 
    "crop_policy": "do_not_crop_face_or_hands", 
    "keep_pose": true, 
    "zoom": "slight zoom-out for wider context" 
  }, 
  "subject_constraints": { 
    "keep_identity": true, 
    "lock_features": ["eyes", "nose", "lips", "eyebrows", "jawline", "face_shape"], 
    "expression_policy": "preserve_original" 
  }, 
  "retouching": { 
    "skin": { 
      "tone": "keep original color", 
      "finish": "smooth, healthy, radiant", 
      "texture": "retain fine pores; avoid plastic look", 
      "blemishes": "lightly reduce temporary blemishes only", 
      "frequency_separation_strength": 0.4, 
      "clarity_microcontrast": 0.15 
    }, 
    "hair": { 
      "finish": "clean, neat, shiny", 
      "flyaways": "reduce but keep natural strands" 
    }, 
    "eyes": { 
      "whites_desaturation": 0.1, 
      "iris_clarity": 0.2, 
      "avoid_overwhitening": true 
    }, 
    "teeth": { 
      "natural_whiten": 0.08, 
      "avoid_pure_white": true 
  }, 
  "clothing": { 
    "policy": "upgrade quality while keeping same/similar style, cut, and color", 
    "fabric_look": "premium, fine weave, crisp edges", 
    "wrinkle_reduction": "moderate", 
    "texture_enhancement": 0.2 
  }, 
  "lighting": { 
    "setup": "bright, soft, even front light", 
    "key": "beauty dish or ring light straight-on", 
    "fill": "broad soft fill to remove harsh shadows", 
    "shadow_control": "minimal, no deep shadows", 
    "specular_highlights": "subtle, flattering", 
    "white_balance": "neutral daylight", 
    "exposure_target": "ETTR without clipping" 
  }, 
  "background": { 
    "type": "solid", 
    "color": "navy blue (#0f2a4a)", 
    "environment": "clean professional photo studio", 
    "gradient": "very subtle center vignette", 
    "separation": "gentle rim lift if needed" 
  }, 
  "color_tone": { 
    "overall": "natural, true-to-life skin tones", 
    "saturation": "moderate", 
    "contrast": "medium with soft roll-off", 
    "vibrance": 0.1 
  }, 
  "detail_sharpness": { 
    "method": "edge-aware sharpening", 
    "amount": 0.35, 
    "radius": 0.8, 
    "threshold": 0.02, 
    "noise_reduction": { 
      "luminance": 0.2, 
      "chroma": 0.25, 
      "preserve_details": 0.8 
  }, 
  "clean_up": { 
    "remove_noise": true, 
    "remove_artifacts": true, 
    "banding_fix_on_background": true 
  "output": { 
    "resolution": "6000x4000", 
    "dpi": 300, 
    "format": "PNG", 
    "color_space": "sRGB IEC61966-2.1", 
    "bit_depth": "16-bit if supported, else 8-bit", 
    "background_alpha": "opaque" 
  "safety_bounds": { 
    "do_not": [ 
      "change face geometry or identity", 
      "change pose", 
      "alter clothing style drastically", 
      "add heavy makeup", 
      "over-smooth or plastic skin", 
      "over-sharpen halos 
  "negative_prompt": [ 
    "plastic skin", 
    "over-whitened eyes/teeth", 
    "harsh shadows", 
    "color casts", 
    "halo artifacts", 
    "muddy blacks", 
    "posterization/banding", 
    "oversaturated skin", 
    "blotchy NR" 
    "face_identity_lock": 0.95, 
    "pose_lock": 0.95, 
    "background_replace_strength": 0.9, 
    "clothes_style_lock": 0.85 
  }, 
  "seed": 142857, 
  "metadata": { 
    "locale": "id-ID", 
    "creator": "professional photo editor style", 
    "purpose": "masterpiece studio portrait upgrade with zoom-out framing"` },
  { label: "Pickleball", maleText: "A young man (use upload photo) on an indoor pickleball court, standing confidently next to the net. He is slim, wearing a bright neon yellow sleeveless tennis shirt and matching shorts, matching visor, long white socks, and neon yellow sneakers. He holds a black pickleball paddle in one hand and a green pickleball in the other, smiling naturally. Behind him is a blue and white sports court wall with the text "ALPHATECH" visible. Keep outfit, pose, and background exactly the same — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. High resolution, realistic details, studio-quality lighting.", femaleText: "A young woman (use upload photo) on an indoor pickleball court, standing confidently next to the net. She is slim, wearing a bright neon yellow sleeveless tennis dress with a pleated skirt, matching visor, long white socks, and neon yellow sneakers. She holds a black pickleball paddle in one hand and a green pickleball in the other, smiling naturally. Behind her is a blue and white sports court wall with the text "ALPHATECH" visible. Keep outfit, pose, and background exactly the same — only replace the face with the one from the uploaded photo, preserving all natural facial features and expressions. High resolution, realistic details, studio-quality lighting." },
  { label: "Quý phái trước gương", maleText: "Create a photo of myself (face based on the uploaded photo) The face must match exactly the person in the reference image. Do not change facial structure, skin tone,\nA glamorous vintage-style portrait of an elegant man (me) standing before an ornate oval mirror. He turned back and looking in the camera. He wears a deep red velvet evening suit with a luxurious fur-trimmed overcoat draped around his shoulders. His accessories include a layered watch chain, a sophisticated tie pin, and a chic black fedora with a decorative band. His grooming is classic with a neatly trimmed mustache or beard and sharp, well-defined features, highlighting his sophisticated handsomeness. The warm golden lighting and mirror reflection create a cinematic, nostalgic atmosphere reminiscent of 1920s–1940s high society fashion photography.", femaleText: "Create a photo of myself (face based on the uploaded photo) The face must match exactly the person in the reference image. Do not change facial structure, skin tone, \nA glamorous vintage-style portrait of an elegant woman (me)  standing before an ornate oval mirror. She turned back and looking in the camera. She wears a deep red velvet evening gown with a luxurious fur stole draped around her shoulders. Her accessories include a layered pearl necklace, pearl drop earrings, and a chic black hat with a decorative veil and flower detail. Her makeup is classic with bold red lips and sharp eyeliner, highlighting her sophisticated beauty. The warm golden lighting and mirror reflection create a cinematic, nostalgic atmosphere reminiscent of 1920s–1940s high society fashion photography." },
  { label: "Sinh Nhật", maleText: "Use the photo above.\nCreate a glamorous birthday photoshoot portrait with flash. The backdrop is a plain neutral wall illuminated by a round spotlight, casting a sharp, dramatic shadow behind me for a cinematic effect. I am posed in profile, leaning slightly forward as if blowing out the candles on a strawberry cake I hold delicately with both hands. The cake is topped with lit number candles {Số tuổi}, their warm glow adding a celebration touch. I am wearing an elegant tailored suit in a deep blue color with", femaleText: "Use the photo above. \nCreate a glamorous birthday photoshoot portrait with flash. The backdrop is a plain neutral wall illuminated by a round spotlight, casting a sharp, dramatic shadow behind me for a cinematic effect. I am posed in profile, leaning slightly forward as if blowing out the candles on a strawberry cake I hold delicately with both hands. The cake is topped with lit number candles {Số tuổi}, their warm glow adding a celebration touch. I am wearing a elegant ball gown in pink color with" },
  { label: "Studio cầm hoa", maleText: "Make a photoshoot of me in a minimalist studio with soft natural lighting. He wears a white suit and holds a vibrant bouquet of white and pink lily flowers. The mood is refined, graceful, and artistic. Make it photorealistic, subject's face should be the same as the given image.", femaleText: "Make a photoshoot of me in a minimalist studio with soft natural lighting. She wears a strapless white gown and holds a vibrant bouquet of white and pink lily flowers. The mood is refined, graceful, and artistic. Make it photorealistic, subject's face should be the same as the given image." },
  { label: "Du lịch Ta Xua", maleText: "a man poses at a scenic viewpoint in Ta Xua, Son La, Vietnam. use upload photo, adjust the subject's scale naturally to fit the breathtaking mountain landscape. The backdrop shows rolling mountains covered in green forests and the iconic sea of clouds stretching endlessly across the valleys. Wooden fences and small local houses can be seen in the distance, adding authenticity to the highland scenery. The atmosphere is serene and majestic, captured in soft natural daylight with a fresh mountain vibe. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16", femaleText: "a women poses at a scenic viewpoint in Ta Xua, Son La, Vietnam. use upload photo, adjust the subject's scale naturally to fit the breathtaking mountain landscape. The backdrop shows rolling mountains covered in green forests and the iconic sea of clouds stretching endlessly across the valleys. Wooden fences and small local houses can be seen in the distance, adding authenticity to the highland scenery. The atmosphere is serene and majestic, captured in soft natural daylight with a fresh mountain vibe. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16" },
  { label: "Du lịch Thái Lan", maleText: `A man poses at Wat Arun (Temple of Dawn) in Bangkok, Thailand, wearing a traditional Thai male outfit (Chut Thai), preserving the exact face and expression from the uploaded reference photo. Adjust the subject's scale naturally to blend with the travel scene. Traditional Thai outfit (male style): Raj pattern jacket (silk, long-sleeved, fitted, in shimmering ivory and gold) with ornate buttons. High-collared inner shirt in white silk. Chong Kraben (draped silk pants) in deep red with golden woven details. Gold sash tied elegantly at the waist. Accessories: golden bracelet, ornate belt buckle, and a traditional ring. Hairstyle: neat, well-groomed, modern but naturally blending with traditional attire.
Backdrop:
The majestic spires of Wat Arun adorned with colorful porcelain mosaics, white pagodas glowing under daylight, and the Chao Phraya River nearby. The sky is bright blue with scattered white clouds, natural daylight creates a radiant and vibrant atmosphere.
Camera style: Shot from an eye-level angle, ultra-realistic 8K high resolution, modern travel photography style, sharp and refined.
Aspect ratio: 9:16`, femaleText: `A portrait of a young woman in traditional Thai attire, standing gracefully by the riverside at sunset with the iconic Wat Arun temple in the background. She wears an elegant gold silk one-shoulder dress (chut thai) with intricate embroidery, layered fabric draped over her shoulder, and a matching golden sash. She is adorned with ornate jewelry: golden earrings, bracelets, rings, and a detailed necklace with red gemstone accents. Her hair is styled in a sleek traditional bun decorated with golden ornaments and white floral garlands. She holds a delicate traditional Thai paper parasol in one hand and a folded wooden fan in the other. The warm sunset light bathes the entire scene, reflecting on the water behind her, creating a cinematic and majestic atmosphere. IMPORTANT: Preserve the exact face, identity, and expression from the uploaded reference photo. Do not alter or approximate the face. The face must remain identical to the uploaded image.", 
  "style": "Cinematic, ultra-realistic photography, cultural heritage, detailed textures", 
  "lighting": "Golden hour sunlight, warm tones, natural highlights, soft background glow", 
  "mood": "Elegant, regal, cultural, serene", 
  "camera": { 
    "shot": "Three-quarter body, front-facing with slight angle", 
    "focus": "Strong focus on subject's face (from uploaded image), Wat Arun softly blurred in background", 
    "aspect_ratio": "9:16" 
  }, 
  "details": { 
    "face": "Use uploaded image for exact facial features, proportions, and expression. Do not modify.", 
    "outfit": { 
      "chut_thai": "Golden silk one-shoulder dress with embroidery and draped sash", 
      "jewelry": "Gold earrings, bracelets, rings, and necklace with red gemstones", 
      "accessories": "Traditional paper parasol, folded wooden fan" 
    }, 
    "background": "Wat Arun temple at sunset, Chao Phraya riverside, glowing sky with golden light" 
  }, 
  "n": 1, 
  "size": "1024x1820", 
  "referenced_image_ids": ["file-JUBNYxv8Dtyj8ccskxtrvo"]` },
  { label: "Pháp Tháp Eiffel", maleText: "A romantic photorealistic portrait of a young man (use upload photo) smiling sweetly, holding a bouquet of roses and baby's breath flowers in front of his face, with only half of his face visible. He has long smooth hair and is wearing a white shirt. In the background, the Eiffel Tower is slightly blurred at sunset, golden hour lighting, dreamy and cinematic atmosphere, 8k resolution, ultra realistic.", femaleText: "A romantic photorealistic portrait of a young woman (use upload photo) smiling sweetly, holding a bouquet of roses and baby's breath flowers in front of her face, with only half of her face visible. She has soft natural makeup, long smooth hair, and is wearing a white blouse. In the background, the Eiffel Tower is slightly blurred at sunset, golden hour lighting, dreamy and cinematic atmosphere, 8k resolution, ultra realistic." },
  { label: "Du lịch Tháp Nghiêng", maleText: "a man poses in front of the Leaning Tower of Pisa, Italy. use upload photo, adjust the subject's scale naturally to fit the iconic landmark scene. The backdrop shows the famous Leaning Tower with its white marble columns tilting distinctly, next to the Pisa Cathedral and the green lawn of Piazza dei Miracoli. The sky is blue with scattered clouds, captured in natural daylight for a bright and cheerful atmosphere. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16.", femaleText: "a women poses in front of the Leaning Tower of Pisa, Italy. use upload photo, adjust the subject's scale naturally to fit the iconic landmark scene. The backdrop shows the famous Leaning Tower with its white marble columns tilting distinctly, next to the Pisa Cathedral and the green lawn of Piazza dei Miracoli. The sky is blue with scattered clouds, captured in natural daylight for a bright and cheerful atmosphere. Shot from an eye-level angle, the photo style is clean and crisp, typical of modern travel photography, ultra-realistic 8K high resolution. The aspect ratio is 9:16." },
  { label: "Thiên Nhiên", maleText: "A very handsome young man (use upload photo) is sitting casually by the edge of a crystal-clear lake, with a backdrop of majestic mountains and lush green pine forests. He wears a cream-colored knitted sweater, classic straight-leg denim jeans, and brown leather boots. Beside him rests a rugged brown leather backpack.\n\nHis expression is serene, looking slightly upward to the right. The sky is bright blue with scattered white clouds hanging above the towering mountains, some peaks still covered in snow. Reflections of the mountains and trees are clearly visible on the turquoise lake surface, creating a calm and beautiful scenery.\n\nThe photography style is a landscape portrait with natural soft lighting that highlights the beauty of the surrounding nature.\nKeep the face and hair exactly as in the uploaded photo, without altering them.", femaleText: "A very beautiful young woman (use upload photo) with straight hair and curly ends is sitting casually by the edge of a crystal-clear lake, with a backdrop of majestic mountains and lush green pine forests. She wears a cream-colored knitted sweater, cut-bray denim jeans, and cream flat shoes. Beside her is a small cream handbag matching her shoes.\n\nHer expression is cheerful, smiling, and looking slightly upward to the right, with her long brown hair flowing freely. The sky is bright blue with scattered white clouds hanging above the towering mountains, some peaks still covered in snow. Reflections of the mountains and trees are clearly visible on the turquoise lake surface, creating a calm and beautiful scenery.\n\nThe photography style is a landscape portrait with natural soft lighting that highlights the beauty of the surrounding nature.\nKeep the face exactly as in the uploaded photo, without altering it." },
  { label: "Trung Thu", maleText: "A man (use upload photo) in a red traditional festive outfit is standing barefoot on a giant mooncake stage. He is gracefully raising his right arm, holding a small lantern, with his left arm extended sideways like dancing. His outfit is a deep red traditional silk tunic (`áo gấm`) with subtle golden patterns, paired with flowing trousers. His hair is styled neatly. The background is a Mid-Autumn Festival setup with a big glowing moon, bright red velvet curtains, colorful paper clouds, green fabric ribbons, and traditional festive toys (lion head, paper rooster, mini lanterns). The atmosphere is joyful, vibrant, and theatrical. Keep all details exactly the same, only replace the face with the one from the uploaded photo.", femaleText: "A women (use upload photo) in a red traditional festive outfit is standing barefoot on a giant mooncake stage. She is gracefully raising his right arm, holding a small lantern, with his left arm extended sideways like dancing. Her outfit is a deep red halter dress with layered fabric and a large bow on the chest, decorated with subtle golden patterns. Her hair is styled neatly with a red flower accessory. The background is a Mid-Autumn Festival setup with a big glowing moon, bright red velvet curtains, colorful paper clouds, green fabric ribbons, and traditional festive toys (lion head, paper rooster, mini lanterns). The atmosphere is joyful, vibrant, and theatrical. Keep all details exactly the same, only replace the face with the one from the uploaded photo." },
  { label: "Công Sở", maleText: "A cinematic portrait of a stylish man (use upload photo) in an all-black tailored suit, sitting confidently while holding a white takeaway coffee cup. He wears bold gold accessories: layered chain bracelet, chunky necklace, statement earrings, and a luxury wristwatch, enhancing his powerful and elegant aura. His dark sunglasses add a mysterious and high-fashion vibe. The scene is illuminated by dramatic golden hour lighting, with sharp shadows and warm highlights, creating a luxurious and editorial look. Keep everything exactly the same, only replace the face with the one from the uploaded image.", femaleText: "A cinematic portrait of a stylish woman (use upload photo) in an all-black tailored suit, sitting confidently while holding a white takeaway coffee cup. She wears bold gold accessories: layered chain bracelet, chunky necklace, statement earrings, and a luxury wristwatch, enhancing her powerful and elegant aura. Her dark sunglasses add a mysterious and high-fashion vibe. The scene is illuminated by dramatic golden hour lighting, with sharp shadows and warm highlights, creating a luxurious and editorial look. Keep everything exactly the same, only replace the face with the one from the uploaded image." }
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
  const [selectedPromptLabel, setSelectedPromptLabel] = useState<string | null>(null);
  const [age, setAge] = useState<string>('25');
  const [embroideryText, setEmbroideryText] = useState<string>('Memory');

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
    setSelectedPromptLabel(selectedPrompt.label);
  }, [gender]);

  const handleGenderChange = useCallback((newGender: 'male' | 'female') => {
    setGender(newGender);
    if (prompt) {
        const currentPromptObject = prompts.find(p => p.maleText === prompt || p.femaleText === prompt);
        if (currentPromptObject) {
            const newPromptText = newGender === 'male' ? currentPromptObject.maleText : currentPromptObject.femaleText;
            setPrompt(newPromptText);
            setSelectedPromptLabel(currentPromptObject.label);
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
    
    let finalPrompt = prompt;
    if (selectedPromptLabel === 'Sinh Nhật') {
      finalPrompt = prompt.replace(/\{Số tuổi\}/g, age || '25');
    } else if (selectedPromptLabel === 'Khung thêu') {
      finalPrompt = prompt.replace(/\{Tên thêu\}/g, embroideryText || 'Memory');
    }

    try {
      const result = await editImageWithPrompt(originalImage.base64, originalImage.mimeType, finalPrompt);
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
  }, [originalImage, prompt, age, selectedPromptLabel, embroideryText]);

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

            {selectedPromptLabel === 'Sinh Nhật' && (
              <div className="mt-2">
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                  Nhập số tuổi cho bánh sinh nhật
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Vd: 25"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            )}
            
            {selectedPromptLabel === 'Khung thêu' && (
              <div className="mt-2">
                <label htmlFor="embroideryText" className="block text-sm font-medium text-gray-300 mb-2">
                  Nhập nội dung cần thêu
                </label>
                <input
                  id="embroideryText"
                  type="text"
                  value={embroideryText}
                  onChange={(e) => setEmbroideryText(e.target.value)}
                  placeholder="Vd: Memory"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            )}
            
            <div className="mt-auto pt-6 border-t border-gray-700/50">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !originalImage || !prompt.trim()}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                >
                    {isLoading ? 'Đang xử lý...' : 'Tạo Ảnh'}
                    {!isLoading && <SparklesIcon />}
                </button>
                {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
            </div>
          </div>
          
          {/* Image Display */}
          <div className="h-full">
            <ImageDisplay originalImage={originalImage} editedImage={editedImage} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;