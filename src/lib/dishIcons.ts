export const DISH_ICON_BASE_PATH = "/dishes/icons/";

// These illustrations include tall/full bowls. Use the shared compact tray size,
// regardless of whether the recipe is viewed in a list or full screen.
const BOWL_DISH_SLUGS = new Set([
  "plain_rice", "rice_bowl", "rice_porridge", "oyakodon", "gyudon", "katsudon",
  "bibimbap", "poke_bowl", "ramen", "pho", "udon", "soba", "noodle_soup", "shellfish", "chawanmushi",
  "oden", "tonjiru", "kenchinjiru", "ozoni", "chicken_soboro_bowl", "tendon", "unadon",
]);

export function getDishIconShape(slug: string | null): "bowl" | undefined {
  return slug && BOWL_DISH_SLUGS.has(slug) ? "bowl" : undefined;
}

type DishIconRule = {
  slug: string;
  keywords: readonly string[];
  category?: DishIconCategory;
};

// 料理名から具体的な見た目を優先して解決する。一般語ほど後ろに置き、
// 「カレーパン→カレー」「魚介パスタ→魚介」のような誤分類を避ける。
const DISH_ICON_RULES: readonly DishIconRule[] = [
  // Specific side dishes, soups and sweets precede broader ingredient/method matches.
  { slug: "croquette", category: "vegetable", keywords: ["コロッケ","croquette","クリームコロッケ","potato croquette","korokke"] },
  { slug: "menchi_katsu", category: "meat", keywords: ["メンチカツ","menchi katsu","ミンチカツ","minced meat cutlet"] },
  { slug: "shrimp_fry", category: "seafood", keywords: ["エビフライ","fried shrimp","海老フライ","えびフライ","ebi fry","breaded shrimp"] },
  { slug: "agedashi_tofu", category: "egg_bean", keywords: ["揚げ出し豆腐","agedashi tofu","揚げだし豆腐","揚出し豆腐"] },
  { slug: "hiyayakko", category: "egg_bean", keywords: ["冷奴","hiyayakko","冷や奴","冷ややっこ","chilled tofu","cold tofu"] },
  { slug: "chikuzenni", category: "soup_stew", keywords: ["筑前煮","chikuzenni","がめ煮","がめに"] },
  { slug: "kinpira_gobo", category: "vegetable", keywords: ["きんぴらごぼう","kinpira gobo","きんぴら","金平","kinpira","braised burdock"] },
  { slug: "spinach_ohitashi", category: "vegetable", keywords: ["おひたし","ohitashi","お浸し","ほうれん草のお浸し"] },
  { slug: "goma_ae", category: "vegetable", keywords: ["ごま和え","goma ae","胡麻和え","胡麻あえ","ごまあえ","sesame dressed vegetables"] },
  { slug: "sunomono", category: "vegetable", keywords: ["酢の物","sunomono","きゅうり酢","cucumber vinegar salad"] },
  { slug: "shiraae", category: "egg_bean", keywords: ["白和え","shiraae","白あえ","しらあえ","shira ae"] },
  { slug: "kabocha_nimono", category: "vegetable", keywords: ["かぼちゃの煮物","simmered kabocha","南瓜の煮物","かぼちゃの煮付","かぼちゃ煮","kabocha nimono"] },
  { slug: "hijiki_nimono", category: "vegetable", keywords: ["ひじきの煮物","hijiki nimono","ひじき煮","simmered hijiki"] },
  { slug: "kiriboshi_daikon", category: "vegetable", keywords: ["切り干し大根","kiriboshi daikon","切干大根","切干し大根","切り干しだいこん"] },
  { slug: "oden", category: "soup_stew", keywords: ["おでん","oden"] },
  { slug: "tonjiru", category: "soup_stew", keywords: ["豚汁","tonjiru","とん汁","とんじる","pork miso soup"] },
  { slug: "kenchinjiru", category: "soup_stew", keywords: ["けんちん汁","kenchinjiru","建長汁","kenchin soup"] },
  { slug: "ozoni", category: "soup_stew", keywords: ["お雑煮","ozoni","雑煮","zoni","mochi soup"] },
  { slug: "miso_mackerel", category: "seafood", keywords: ["鯖の味噌煮","miso simmered mackerel","さばの味噌煮","サバの味噌煮","鯖味噌煮","さば味噌煮","saba misoni","mackerel in miso"] },
  { slug: "fish_foil_bake", category: "seafood", keywords: ["鮭のホイル焼き","salmon foil bake","魚のホイル焼き","鮭のホイル","salmon in foil","foil baked fish","foil baked salmon"] },
  { slug: "nanbanzuke", category: "seafood", keywords: ["南蛮漬け","nanbanzuke","南蛮漬","南蛮づけ","nanban zuke"] },
  { slug: "chicken_soboro_bowl", category: "rice", keywords: ["そぼろ丼","soboro rice bowl","そぼろご飯","そぼろごはん","三色丼","soboro don","soboro donburi"] },
  { slug: "tendon", category: "rice", keywords: ["天丼","tempura rice bowl","てんどん","tendon"] },
  { slug: "unadon", category: "rice", keywords: ["うな丼","eel rice bowl","鰻丼","うな重","鰻重","unadon","unaju"] },
  { slug: "kakiage", category: "vegetable", keywords: ["かき揚げ","kakiage","かきあげ","vegetable tempura fritter"] },
  { slug: "chicken_tsukune", category: "meat", keywords: ["つくね","tsukune","chicken meatball skewer"] },
  { slug: "pork_kakuni", category: "meat", keywords: ["豚の角煮","braised pork belly","豚角煮","角煮","kakuni"] },
  { slug: "simmered_daikon", category: "vegetable", keywords: ["大根の煮物","simmered daikon","大根煮","ふろふき大根","daikon nimono"] },
  { slug: "shumai", category: "meat", keywords: ["焼売","shumai","シュウマイ","しゅうまい","シューマイ","焼き売り","siu mai","shaomai"] },
  { slug: "mapo_eggplant", category: "vegetable", keywords: ["麻婆茄子","mapo eggplant","麻婆なす","マーボーナス","マーボー茄子"] },
  { slug: "chicken_piccata", category: "meat", keywords: ["チキンピカタ","chicken piccata","鶏のピカタ","鶏肉のピカタ","piccata"] },
  { slug: "bagna_cauda", category: "vegetable", keywords: ["バーニャカウダ","bagna cauda"] },
  { slug: "quiche", category: "bread_snack", keywords: ["キッシュ","quiche"] },
  { slug: "seafood_ajillo", category: "seafood", keywords: ["アヒージョ","ajillo","gambas al ajillo","shrimp in garlic oil"] },
  { slug: "caprese", category: "vegetable", keywords: ["カプレーゼ","caprese"] },
  { slug: "sweet_potato_dessert", category: "dessert_drink", keywords: ["スイートポテト","japanese sweet potato cake","sweet potato cake"] },
  { slug: "french_toast", category: "dessert_drink", keywords: ["フレンチトースト","french toast"] },
  { slug: "apple_crumble", category: "dessert_drink", keywords: ["アップルクランブル","apple crumble","apple crisp"] },
  { slug: "cinnamon_roll", category: "dessert_drink", keywords: ["シナモンロール","cinnamon roll","cinnamon bun"] },
  // Everyday dishes need their own silhouettes before generic steak/egg/stew rules.
  { slug: "hamburger_steak", keywords: ["ハンバーグ", "hamburg steak", "hamburger steak", "salisbury steak", "hambagu", "hambāgu", "tofu hamburger", "tofu hamburg"] },
  { slug: "nikujaga", keywords: ["肉じゃが", "肉ジャガ", "nikujaga", "japanese beef and potato stew", "japanese pork and potato stew", "japanese meat and potato stew"] },
  { slug: "cabbage_rolls", keywords: ["ロールキャベツ", "キャベツロール", "cabbage roll", "stuffed cabbage", "rolled cabbage"] },
  { slug: "ginger_pork", keywords: ["生姜焼き", "生姜焼", "しょうが焼", "ショウガ焼", "shogayaki", "shōgayaki", "ginger pork", "pork ginger", "ginger glazed pork", "ginger grilled pork"] },
  { slug: "omurice", keywords: ["オムライス", "omurice", "omu rice", "omelet rice", "omelette rice", "rice omelet", "rice omelette"] },
  { slug: "tamagoyaki", keywords: ["卵焼き", "玉子焼き", "卵焼", "玉子焼", "だし巻", "出汁巻", "tamagoyaki", "dashimaki", "rolled omelet", "rolled omelette", "japanese rolled egg"] },
  { slug: "chicken_nanban", keywords: ["チキン南蛮", "鶏の南蛮", "chicken nanban", "nanban chicken"] },
  { slug: "gratin", keywords: ["グラタン", "ドリア", "gratin", "doria"] },
  { slug: "chawanmushi", keywords: ["茶碗蒸し", "茶わん蒸し", "ちゃわんむし", "chawanmushi", "savory egg custard", "savoury egg custard", "steamed egg custard"] },
  { slug: "shrimp_chili", keywords: ["エビチリ", "えびチリ", "海老チリ", "エビのチリ", "えびのチリ", "海老のチリ", "ebi chili", "ebi chilli", "chili shrimp", "chilli shrimp", "shrimp in chili sauce", "shrimp in chilli sauce", "prawns in chili sauce", "prawns in chilli sauce"] },
  { slug: "meat_rolls", keywords: ["肉巻き", "肉巻", "肉まき", "豚巻き", "豚バラ巻", "牛肉巻き", "ベーコン巻", "nikumaki", "negimaki", "meat roll", "pork roll", "beef roll", "bacon wrapped", "pork wrapped", "beef wrapped", "wrapped in pork", "wrapped in beef", "wrapped in bacon"] },
  // 文化圏ごとの代表料理は、見た目の近い汎用カテゴリへ落とす前に固有画像を優先する。
  { slug: "oyakodon", keywords: ["親子丼", "oyakodon", "chicken and egg rice bowl"] },
  { slug: "gyudon", keywords: ["牛丼", "gyudon", "beef bowl"] },
  { slug: "katsudon", keywords: ["カツ丼", "かつ丼", "katsudon", "pork cutlet rice bowl"] },
  { slug: "tempura", keywords: ["天ぷら", "天麩羅", "tempura"] },
  { slug: "miso_soup", keywords: ["味噌汁", "みそ汁", "miso soup"] },
  { slug: "yakisoba", keywords: ["焼きそば", "焼そば", "yakisoba"] },
  { slug: "teriyaki_chicken", keywords: ["照り焼きチキン", "鶏の照り焼き", "鶏肉の照り焼き", "鶏ももの照り焼き", "鶏むねの照り焼き", "teriyaki chicken", "chicken teriyaki"] },
  { slug: "bulgogi", keywords: ["プルコギ", "불고기", "bulgogi"] },
  { slug: "tteokbokki", keywords: ["トッポギ", "떡볶이", "tteokbokki", "topokki"] },
  { slug: "japchae", keywords: ["チャプチェ", "잡채", "japchae"] },
  { slug: "kimchi_jjigae", keywords: ["キムチチゲ", "キムチ鍋", "김치찌개", "kimchi jjigae", "kimchi stew"] },
  { slug: "dim_sum", keywords: ["点心", "飲茶", "dim sum", "yum cha"] },
  { slug: "spring_rolls", keywords: ["春巻き", "春巻", "spring roll"] },
  { slug: "sweet_sour_pork", keywords: ["酢豚", "古老肉", "sweet and sour pork"] },
  { slug: "thai_green_curry", keywords: ["タイグリーンカレー", "グリーンカレー", "ゲーンキョウワーン", "thai green curry", "green curry"] },
  { slug: "laksa", keywords: ["ラクサ", "laksa"] },
  { slug: "nasi_goreng", keywords: ["ナシゴレン", "nasi goreng"] },
  { slug: "chicken_tikka_masala", keywords: ["チキンティッカマサラ", "chicken tikka masala"] },
  { slug: "chana_masala", keywords: ["チャナマサラ", "ひよこ豆カレー", "chana masala", "chole masala"] },
  { slug: "tagine", keywords: ["タジン鍋", "タジン", "tagine", "tajine"] },
  { slug: "tabbouleh", keywords: ["タブーリ", "タブレ", "tabbouleh", "tabouli"] },
  { slug: "enchiladas", keywords: ["エンチラーダ", "enchilada"] },
  { slug: "tamales", keywords: ["タマレス", "タマル", "tamale"] },
  { slug: "mac_and_cheese", keywords: ["マカロニチーズ", "マックアンドチーズ", "mac and cheese", "macaroni and cheese"] },
  { slug: "shepherds_pie", keywords: ["シェパーズパイ", "コテージパイ", "shepherd's pie", "shepherd’s pie", "cottage pie"] },

  { slug: "ramen", keywords: ["ラーメン", "ramen"] },
  { slug: "pho", keywords: ["フォー", "phở", "pho"] },
  { slug: "udon", keywords: ["うどん", "饂飩", "udon"] },
  { slug: "soba", keywords: ["そば", "蕎麦", "soba"] },
  { slug: "bibimbap", keywords: ["ビビンバ", "ピビンパ", "bibimbap"] },
  { slug: "poke_bowl", keywords: ["ポケボウル", "ポキボウル", "ポキ丼", "poke bowl", "poke"] },
  { slug: "pad_thai", keywords: ["パッタイ", "パッ・タイ", "pad thai"] },
  { slug: "tom_yum", keywords: ["トムヤム", "tom yum"] },
  { slug: "butter_chicken", keywords: ["バターチキン", "ムルグマカニ", "butter chicken", "murgh makhani"] },
  { slug: "masala_dosa", keywords: ["マサラドーサ", "ドーサ", "masala dosa", "dosa"] },
  { slug: "falafel_plate", keywords: ["ファラフェル", "falafel"] },
  { slug: "shawarma", keywords: ["シャワルマ", "シャウルマ", "shawarma"] },
  { slug: "moussaka", keywords: ["ムサカ", "moussaka"] },
  { slug: "shakshuka", keywords: ["シャクシュカ", "shakshuka"] },
  { slug: "ratatouille", keywords: ["ラタトゥイユ", "ratatouille"] },
  { slug: "fish_and_chips", keywords: ["フィッシュアンドチップス", "フィッシュ＆チップス", "fish and chips"] },
  { slug: "ceviche", keywords: ["セビーチェ", "セビチェ", "ceviche"] },
  { slug: "feijoada", keywords: ["フェイジョアーダ", "feijoada"] },
  { slug: "jollof_rice", keywords: ["ジョロフライス", "jollof rice", "jollof"] },
  { slug: "arepa", keywords: ["アレパ", "arepa"] },
  { slug: "pierogi", keywords: ["ピエロギ", "pierogi"] },
  { slug: "borscht", keywords: ["ボルシチ", "borscht", "borsch"] },
  { slug: "injera_platter", keywords: ["インジェラ", "injera"] },
  { slug: "gazpacho", keywords: ["ガスパチョ", "gazpacho"] },
  { slug: "mapo_tofu", keywords: ["麻婆豆腐", "マーボー豆腐", "mapo tofu", "mapo doufu"] },

  { slug: "pilaf_biryani", keywords: ["ビリヤニ", "biryani", "ピラフ", "pilaf"] },
  { slug: "fried_rice", keywords: ["炒飯", "チャーハン", "fried rice", "nasi goreng"] },
  { slug: "rice_porridge", keywords: ["おかゆ", "お粥", "雑炊", "リゾット風おかゆ", "congee", "rice porridge", "juk"] },
  { slug: "risotto", keywords: ["リゾット", "risotto"] },
  { slug: "paella", keywords: ["パエリア", "paella"] },
  { slug: "sushi", keywords: ["寿司", "鮨", "sushi", "nigiri", "maki sushi"] },
  { slug: "rice_ball", keywords: ["おにぎり", "おむすび", "rice ball", "onigiri"] },
  { slug: "stuffed_rice_roll", keywords: ["キンパ", "巻き寿司", "太巻", "rice roll", "gimbap", "kimbap"] },
  { slug: "curry_rice", keywords: ["カレーライス", "カレー", "curry", "カリー"] },
  { slug: "rice_bowl", keywords: ["丼", "どんぶり", "rice bowl", "donburi", "bibimbap", "ビビンバ"] },
  { slug: "mixed_rice", keywords: ["炊き込みご飯", "混ぜご飯", "takikomi", "mixed rice", "jollof"] },
  { slug: "couscous", keywords: ["クスクス", "couscous"] },
  { slug: "plain_rice", keywords: ["白ご飯", "白米", "ごはん", "ご飯", "steamed white rice", "white rice", "steamed rice", "plain rice", "cooked rice"] },

  { slug: "baked_pasta", keywords: ["ラザニア", "グラタン", "baked pasta", "lasagna", "pasta bake"] },
  { slug: "stuffed_pasta", keywords: ["ラビオリ", "トルテリーニ", "ravioli", "tortellini", "stuffed pasta"] },
  { slug: "gnocchi", keywords: ["ニョッキ", "gnocchi"] },
  { slug: "creamy_pasta", keywords: ["カルボナーラ", "クリームパスタ", "alfredo", "carbonara", "creamy pasta"] },
  { slug: "noodle_stir_fry", keywords: ["焼きそば", "焼うどん", "炒麺", "チャウミン", "pad thai", "chow mein", "stir-fried noodle", "fried noodle"] },
  { slug: "cold_noodles", keywords: ["冷やし中華", "冷麺", "ざるそば", "そうめん", "cold noodle", "naengmyeon"] },
  { slug: "flat_noodles", keywords: ["きしめん", "ほうとう", "フェットチーネ", "タリアテッレ", "flat noodle", "fettuccine", "tagliatelle"] },
  { slug: "noodle_soup", keywords: ["ラーメン", "うどん", "そば", "フォー", "麺スープ", "noodle soup", "ramen", "udon", "pho"] },
  { slug: "pasta", keywords: ["パスタ", "スパゲティ", "スパゲッティ", "pasta", "spaghetti"] },

  { slug: "fried_fish", keywords: ["フィッシュフライ", "魚フライ", "白身魚フライ", "fish and chips", "fried fish"] },
  { slug: "fish_stew", keywords: ["魚の煮付", "煮付け", "魚煮込み", "さば味噌煮", "鯖味噌煮", "あら煮", "ブイヤベース", "fish stew", "fish curry", "cioppino"] },
  { slug: "seafood_platter", keywords: ["シーフード盛", "海鮮盛", "seafood platter", "mixed seafood"] },
  { slug: "shellfish", keywords: ["貝料理", "ムール貝", "あさり", "牡蠣", "shellfish", "mussels", "clams", "oyster"] },
  { slug: "grilled_fish", keywords: ["焼き魚", "魚の塩焼", "塩焼き", "西京焼き", "幽庵焼き", "魚のグリル", "魚のムニエル", "鮭のムニエル", "味噌マヨホイル", "鮭のホイル", "grilled fish", "焼鮭", "焼き鮭", "salmon meuniere"] },
  { slug: "seafood_soup", keywords: ["海鮮スープ", "魚介スープ", "クラムチャウダー", "seafood soup", "clam chowder"] },

  { slug: "fried_chicken", keywords: ["唐揚げ", "から揚げ", "フライドチキン", "チキン南蛮", "fried chicken", "karaage"] },
  { slug: "chicken_skewer", keywords: ["焼き鳥", "チキン串", "鶏串", "chicken skewer", "chicken kebab", "yakitori"] },
  { slug: "roast_chicken", keywords: ["ローストチキン", "丸鶏", "roast chicken", "roasted chicken"] },
  { slug: "grilled_chicken", keywords: ["グリルチキン", "鶏のグリル", "照り焼きチキン", "鶏の照り焼き", "チキンソテー", "grilled chicken", "chicken steak", "teriyaki chicken"] },
  { slug: "meat_cutlet", keywords: ["とんかつ", "トンカツ", "カツレツ", "シュニッツェル", "cutlet", "tonkatsu", "schnitzel"] },
  { slug: "meat_skewer", keywords: ["肉串", "ケバブ", "サテ", "meat skewer", "kebab", "satay"] },
  { slug: "meatballs", keywords: ["ミートボール", "肉団子", "つくね", "meatball", "kofta"] },
  { slug: "sausage_plate", keywords: ["ソーセージ", "ウインナー", "sausage", "bratwurst"] },
  { slug: "roast_meat", keywords: ["ローストビーフ", "ローストポーク", "焼豚", "チャーシュー", "roast beef", "roast pork"] },
  { slug: "steak", keywords: ["ステーキ", "steak"] },
  { slug: "grilled_meat", keywords: ["焼肉", "肉のグリル", "バーベキュー", "grilled meat", "barbecue", "bbq"] },

  { slug: "omelet", keywords: ["オムレツ", "オムライス", "omelet", "omelette"] },
  { slug: "egg_dish", keywords: ["目玉焼き", "卵焼き", "だし巻", "スクランブルエッグ", "fried egg", "scrambled egg", "egg dish"] },
  { slug: "tofu_dish", keywords: ["豆腐料理", "麻婆豆腐", "冷奴", "揚げ出し豆腐", "tofu", "mapo tofu"] },
  { slug: "lentil_dish", keywords: ["レンズ豆", "ダール", "lentil", "dal", "dhal"] },
  { slug: "bean_dish", keywords: ["豆料理", "チリコンカン", "beans", "bean stew", "chili con carne"] },
  { slug: "stuffed_vegetable", keywords: ["肉詰め", "stuffed pepper", "stuffed vegetable", "dolma"] },

  { slug: "tomato_soup", keywords: ["トマトスープ", "ミネストローネ", "tomato soup", "minestrone"] },
  { slug: "cream_soup", keywords: ["クリームスープ", "ポタージュ", "cream soup", "potage", "bisque"] },
  { slug: "spicy_soup", keywords: ["辛いスープ", "酸辣湯", "ユッケジャン", "トムヤム", "spicy soup", "hot and sour soup", "tom yum"] },
  { slug: "bean_soup", keywords: ["豆スープ", "bean soup", "lentil soup"] },
  { slug: "hotpot", keywords: ["鍋料理", "寄せ鍋", "しゃぶしゃぶ", "すき焼き", "火鍋", "hotpot", "hot pot", "shabu-shabu", "sukiyaki"] },
  { slug: "clear_soup", keywords: ["お吸い物", "澄まし汁", "コンソメスープ", "clear soup", "consommé", "consomme"] },
  { slug: "stew", keywords: ["シチュー", "煮込み", "煮物", "肉じゃが", "筑前煮", "stew", "goulash"] },
  { slug: "cheese_fondue", keywords: ["チーズフォンデュ", "cheese fondue", "fondue"] },
  { slug: "casserole", keywords: ["キャセロール", "casserole"] },
  { slug: "baked_dish", keywords: ["オーブン焼き", "ベイク", "baked dish", "oven-baked"] },

  { slug: "pickled_vegetables", keywords: ["漬物", "ピクルス", "キムチ", "pickled vegetable", "pickles", "kimchi"] },
  { slug: "vegetable_skewer", keywords: ["野菜串", "vegetable skewer", "vegetable kebab"] },
  { slug: "roasted_vegetables", keywords: ["ロースト野菜", "焼き野菜", "roasted vegetable", "grilled vegetable"] },
  { slug: "steamed_vegetables", keywords: ["蒸し野菜", "温野菜", "steamed vegetable"] },
  { slug: "vegetable_stir_fry", keywords: ["野菜炒め", "炒め野菜", "キャベツ炒め", "もやし炒め", "きのこ炒め", "vegetable stir-fry", "stir-fried vegetable"] },
  { slug: "salad", keywords: ["サラダ", "salad"] },
  { slug: "dip_spread", keywords: ["フムス", "ディップ", "パテ", "hummus", "dip", "spread"] },

  { slug: "savory_pancake", keywords: ["お好み焼き", "チヂミ", "savory pancake", "okonomiyaki", "jeon"] },
  { slug: "dumplings", keywords: ["餃子", "水餃子", "小籠包", "ワンタン", "dumpling", "gyoza", "wonton"] },
  { slug: "steamed_bun", keywords: ["肉まん", "中華まん", "包子", "steamed bun", "bao"] },
  { slug: "stuffed_pastry", keywords: ["エンパナーダ", "サモサ", "empanada", "samosa", "stuffed pastry"] },
  { slug: "savory_pie", keywords: ["キッシュ", "ミートパイ", "savory pie", "quiche", "pot pie"] },
  { slug: "flatbread", keywords: ["ナン", "ピタ", "フォカッチャ", "flatbread", "naan", "pita", "focaccia"] },
  { slug: "bread_loaf", keywords: ["食パン", "パン一斤", "バゲット", "bread loaf", "loaf", "baguette"] },
  { slug: "pizza", keywords: ["ピザ", "pizza"] },
  { slug: "burger", keywords: ["ハンバーガー", "バーガー", "hamburger", "burger"] },
  { slug: "wrap", keywords: ["ラップサンド", "ブリトー", "トルティーヤラップ", "wrap", "burrito"] },
  { slug: "taco", keywords: ["タコス", "taco"] },
  { slug: "toast", keywords: ["トースト", "ブルスケッタ", "toast", "bruschetta"] },
  { slug: "sandwich", keywords: ["サンドイッチ", "サンド", "sandwich", "panini"] },

  { slug: "whole_cake", keywords: ["ホールケーキ", "バースデーケーキ", "whole cake", "birthday cake"] },
  { slug: "strawberry_cake", keywords: ["いちごケーキ", "苺ケーキ", "ショートケーキ", "strawberry cake"] },
  { slug: "fruit_tart", keywords: ["フルーツタルト", "fruit tart"] },
  { slug: "pie_slice", keywords: ["アップルパイ", "チェリーパイ", "パイ", "pie slice", "apple pie", "cherry pie"] },
  { slug: "pancake", keywords: ["パンケーキ", "ホットケーキ", "pancake", "hotcake"] },
  { slug: "waffle", keywords: ["ワッフル", "waffle"] },
  { slug: "crepe", keywords: ["クレープ", "crepe", "crêpe"] },
  { slug: "donut", keywords: ["ドーナツ", "donut", "doughnut"] },
  { slug: "cupcake", keywords: ["カップケーキ", "マフィン", "cupcake", "muffin"] },
  { slug: "cookie", keywords: ["クッキー", "ビスケット", "cookie", "biscuit"] },
  { slug: "brownie", keywords: ["ブラウニー", "brownie"] },
  { slug: "pudding", keywords: ["プリン", "pudding", "flan"] },
  { slug: "custard", keywords: ["カスタード", "custard"] },
  { slug: "ice_cream", keywords: ["アイスクリーム", "ジェラート", "ice cream", "gelato"] },
  { slug: "popsicle", keywords: ["アイスキャンディ", "棒アイス", "popsicle", "ice pop"] },
  { slug: "shaved_ice", keywords: ["かき氷", "shaved ice", "bingsu"] },
  { slug: "fruit_bowl", keywords: ["フルーツ盛", "フルーツボウル", "fruit bowl", "fruit salad"] },
  { slug: "mochi", keywords: ["餅", "もち", "大福", "mochi", "daifuku"] },
  { slug: "sweet_bun", keywords: ["あんパン", "あんぱん", "菓子パン", "sweet bun", "red bean bun"] },
  { slug: "chocolate_sweets", keywords: ["チョコレート", "ボンボン", "chocolate", "truffle chocolate"] },
  { slug: "parfait", keywords: ["パフェ", "parfait", "sundae"] },
  { slug: "smoothie", keywords: ["スムージー", "シェイク", "smoothie", "milkshake"] },
  { slug: "hot_drink", keywords: ["コーヒー", "紅茶", "ココア", "ホットドリンク", "coffee", "tea", "hot chocolate"] },

  { slug: "fried_food", keywords: ["揚げ物", "フライ", "天ぷら", "コロッケ", "fried", "tempura", "croquette"] },
  { slug: "meat_stir_fry", keywords: ["肉炒め", "豚バラ炒め", "豚肉炒め", "牛肉炒め", "回鍋肉", "青椒肉絲", "生姜焼き", "しょうが焼き", "stir-fried meat", "meat stir-fry"] },
];

export type DishIconCategory =
  | "rice"
  | "noodle"
  | "soup_stew"
  | "meat"
  | "seafood"
  | "egg_bean"
  | "vegetable"
  | "bread_snack"
  | "dessert_drink"
  | "other";

export const DISH_ICON_SLUGS = Array.from(new Set(DISH_ICON_RULES.map((rule) => rule.slug)));

function containsJapanese(value: string): boolean {
  return /[\u3040-\u30ff\u3400-\u9fff]/u.test(value);
}

export function getDishIconDisplayName(slug: string, language: "ja" | "en" = "ja"): string {
  const rule = DISH_ICON_RULES.find((candidate) => candidate.slug === slug);
  const keywords = rule?.keywords || [];
  if (language === "ja") return keywords.find(containsJapanese) || keywords[0] || slug;
  const english = keywords.find((keyword) => /[a-z]/i.test(keyword) && !containsJapanese(keyword));
  if (english) return english.replace(/\b\w/g, (letter) => letter.toUpperCase());
  return slug.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getDishIconCategory(slug: string): DishIconCategory {
  const explicitCategory = DISH_ICON_RULES.find(rule => rule.slug === slug)?.category;
  if (explicitCategory) return explicitCategory;
  if (slug === "chawanmushi" || slug === "tamagoyaki") return "egg_bean";
  if (slug === "omurice") return "rice";
  if (slug === "shrimp_chili") return "seafood";
  if (["nikujaga", "cabbage_rolls", "gratin"].includes(slug)) return "soup_stew";
  if (/(cake|tart|pie_slice|pancake|waffle|crepe|donut|cupcake|cookie|brownie|pudding|custard|ice_cream|popsicle|shaved_ice|fruit_bowl|mochi|sweet_bun|chocolate|parfait|smoothie|hot_drink)/.test(slug)) return "dessert_drink";
  if (/(ramen|pho|udon|soba|yakisoba|tteokbokki|japchae|laksa|pad_thai|pasta|gnocchi|noodle)/.test(slug)) return "noodle";
  if (/(rice|don$|donburi|bibimbap|poke_bowl|nasi_goreng|jollof|pilaf|biryani|risotto|paella|sushi)/.test(slug)) return "rice";
  if (/(soup|stew|hotpot|jjigae|tom_yum|tagine|borscht|gazpacho|curry|masala|shakshuka|feijoada|fondue|casserole|baked_dish)/.test(slug)) return "soup_stew";
  if (/(fish|seafood|shellfish|ceviche)/.test(slug)) return "seafood";
  if (/(chicken|meat|steak|bulgogi|pork|sausage|shawarma|kebab|cutlet|meatball|burger|shepherd)/.test(slug)) return "meat";
  if (/(egg|omelet|tofu|lentil|bean|mapo)/.test(slug)) return "egg_bean";
  if (/(vegetable|salad|ratatouille|tabbouleh|pickled|dip_spread|falafel)/.test(slug)) return "vegetable";
  if (/(bread|toast|sandwich|pizza|wrap|taco|arepa|dosa|dumpling|dim_sum|spring_roll|tamale|pastry|savory|steamed_bun|pierogi|injera)/.test(slug)) return "bread_snack";
  return "other";
}

function normalizeDishName(name: string): string {
  return name.normalize("NFKC").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC")
    .replace(/[‐‑‒–—―-]/g, " ").replace(/\s+/g, " ").trim();
}

function matchesKeyword(name: string, keyword: string): boolean {
  const normalized = normalizeDishName(keyword);
  if (containsJapanese(normalized) || !/^[a-z]/.test(normalized)) return name.includes(normalized);
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // English fragments such as tea/pho/cod must not match steamed/photograph/avocado.
  return new RegExp(`(?:^|[^a-z])${escaped}(?:s|es)?(?:$|[^a-z])`).test(name);
}

export function getDishIconSlug(name: string): string | null {
  const normalized = normalizeDishName(name);
  if (!normalized) return null;

  const meat = /(豚|牛|鶏|チキン|ポーク|ビーフ|肉|ベーコン)/.test(normalized)
    || /\b(pork|beef|chicken|meat|bacon|turkey)\b/.test(normalized);
  const fish = /(魚|鮭|さけ|サーモン|鯖|さば|鰤|ぶり|鱈|たら)/.test(normalized)
    || /\b(fish|salmon|mackerel|cod|trout|tuna)\b/.test(normalized);
  const stirFry = /炒/.test(normalized) || /\bstir (?:fry|fried|frying)\b/.test(normalized);
  const saute = /ソテー/.test(normalized) || /\bsaute(?:ed)?\b/.test(normalized);
  let ingredientFallback: string | null = null;

  for (const rule of DISH_ICON_RULES) {
    // A stir-fried chicken dish is not deep-fried chicken.
    if (stirFry && ["fried_chicken", "fried_fish", "fried_food", "shrimp_fry"].includes(rule.slug)) continue;
    const keyword = rule.keywords.find(keyword => matchesKeyword(normalized, keyword));
    if (!keyword) continue;
    // Let the dish (soup/salad/stir-fry) take precedence over a bare ingredient.
    if (["tofu", "lentil", "beans"].includes(keyword)) {
      ingredientFallback ??= rule.slug;
      continue;
    }
    if (rule.slug === "vegetable_stir_fry" && meat) return "meat_stir_fry";
    return rule.slug;
  }

  // AIが「豚バラとキャベツの旨辛炒め」のように食材を料理法の間へ挟むと、
  // 完全な語句ルールだけでは既存アイコンを使えない。料理法＋主役カテゴリの
  // 組み合わせで最後の補完を行い、ジャンルの汎用画像へ落ちる件数を減らす。
  if (meat && stirFry) return "meat_stir_fry";
  if (fish && (saute || /(焼|グリル|ホイル|ムニエル|grill|bake|meuniere|pan sear|pan fried)/.test(normalized))) return "grilled_fish";
  if (/(鶏|チキン)/.test(normalized) || /\bchicken\b/.test(normalized)) {
    if (/(照り焼|照焼|teriyaki)/.test(normalized)) return "teriyaki_chicken";
    if (/(ロースト|roast)/.test(normalized)) return "roast_chicken";
    if (saute || /(焼|グリル|grill|bake|pan sear)/.test(normalized)) return "grilled_chicken";
  }
  if (meat && saute) return "meat_stir_fry";
  if (stirFry || saute) return "vegetable_stir_fry";
  if (/(汁|スープ|味噌汁|soup|broth)/.test(normalized)) return "clear_soup";
  if (/(煮|煮込|stew|braise)/.test(normalized)) return "stew";
  if (meat && /(焼|グリル|grill|pan sear)/.test(normalized)) return "grilled_meat";
  if (/(蒸し|steamed)/.test(normalized) && /(野菜|キャベツ|ブロッコリー|carrot|broccoli|cabbage|vegetable)/.test(normalized)) return "steamed_vegetables";
  if (/(焼|オーブン|bake|roast)/.test(normalized)) return "baked_dish";
  return ingredientFallback;
}

export function getDishIconUrl(name: string): string | null {
  const slug = getDishIconSlug(name);
  return slug ? `${DISH_ICON_BASE_PATH}${slug}.png` : null;
}
