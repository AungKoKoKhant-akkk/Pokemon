/**
 * Language and localization constants
 */

// Supported languages
export const LANGUAGES = {
    EN: 'en',
    JA: 'ja'
};

// Default language
export const DEFAULT_LANGUAGE = LANGUAGES.EN;

// UI Translations
export const UI_TRANSLATIONS = {
    en: {
        // Navigation
        nav_home: 'Home',
        nav_compare: 'Compare',
        nav_quiz: 'Quiz',
        nav_favorites: 'Favorites',

        // Common actions
        action_back: 'Back to Pokemon List',
        action_add_to_comparison: 'Add to Comparison',
        action_remove_from_comparison: 'Remove from Comparison',
        action_add_to_favorites: 'Add to Favorites',
        action_remove_from_favorites: 'Remove from Favorites',
        action_compare: 'Compare',
        action_clear_all: 'Clear All',
        action_go_back: 'Go Back',

        // Pokemon Detail
        detail_basic_info: 'Basic Information',
        detail_height: 'Height',
        detail_weight: 'Weight',
        detail_base_experience: 'Base Experience',
        detail_abilities: 'Abilities',
        detail_description: 'Description',
        detail_evolution_chain: 'Evolution Chain',
        detail_stats: 'Stats',
        detail_moves: 'Moves',
        detail_sprites: 'Sprites Gallery',
        detail_hidden: 'Hidden',
        detail_current_pokemon: 'Current Pokemon',
        detail_click_to_view: 'Click to view',

        // Stats
        stat_hp: 'HP',
        stat_attack: 'Attack',
        stat_defense: 'Defense',
        stat_special_attack: 'Sp. Attack',
        stat_special_defense: 'Sp. Defense',
        stat_speed: 'Speed',

        // Messages
        msg_loading: 'Loading Pokemon Details...',
        msg_not_found: 'Pokemon not found',
        msg_no_favorites: 'No favorites yet',
        msg_add_favorites: 'Add some Pokemon to your favorites!',
        msg_comparison_limit: 'Maximum 3 Pokemon can be compared at once',
        msg_comparison_limit_reached: 'Comparison limit reached',
        msg_added_to_favorites: 'added to favorites!',
        msg_removed_from_favorites: 'removed from favorites',
        msg_no_description: 'No description available',

        // Search
        search_placeholder: 'Search Pokemon...',
        search_type_filter: 'Filter by Type',
        search_all_types: 'All Types',

        // Grid/Filter Info
        grid_showing: 'Showing',
        grid_of: 'of',
        label_pokemon: 'Pokemon',

        // Pokemon Types
        type_normal: 'NORMAL',
        type_fire: 'FIRE',
        type_water: 'WATER',
        type_electric: 'ELECTRIC',
        type_grass: 'GRASS',
        type_ice: 'ICE',
        type_fighting: 'FIGHTING',
        type_poison: 'POISON',
        type_ground: 'GROUND',
        type_flying: 'FLYING',
        type_psychic: 'PSYCHIC',
        type_bug: 'BUG',
        type_rock: 'ROCK',
        type_ghost: 'GHOST',
        type_dragon: 'DRAGON',
        type_dark: 'DARK',
        type_steel: 'STEEL',
        type_fairy: 'FAIRY',

        // Comparison
        comparison_title: 'Pokemon Comparison',
        comparison_empty: 'No Pokemon selected for comparison',
        comparison_select: 'Select up to 3 Pokemon to compare',
        comparison_analyzing: 'Analyzing Pokemon side by side',
        comparison_selected: 'Pokemon Selected',
        comparison_add_more: 'Add More Pokemon',
        comparison_try_again: 'Try Again',
        comparison_total_stats: 'Total Stats',
        comparison_average: 'Average',
        comparison_types: 'Types',

        // Quiz
        quiz_title: 'Pokemon Quiz',
        quiz_title_long: 'Pokemon Quiz Challenge',
        quiz_subtitle: 'Test your Pokemon knowledge!',
        quiz_choose_challenge: 'Choose Your Challenge',
        quiz_game_mode: 'Game Mode',
        quiz_mode_image: 'Guess by Image',
        quiz_mode_description: 'Guess by Description',
        quiz_mode_type: 'Guess by Type',
        quiz_mode_silhouette: 'Guess Silhouette',
        quiz_difficulty_level: 'Difficulty Level',
        quiz_diff_easy: 'Easy',
        quiz_diff_medium: 'Medium',
        quiz_diff_hard: 'Hard',
        quiz_questions: 'Questions',
        quiz_seconds_short: 's',
        quiz_per_question: 'per question',
        quiz_start: 'Start Quiz',
        quiz_question: 'Question',
        quiz_of: 'of',
        quiz_score_label: 'Score',
        quiz_loading_title: 'Loading Pokemon Quiz...',
        quiz_loading_subtitle: 'Preparing your Pokemon adventure!',
        quiz_loading_progress: 'Loading Pokemon data...',
        quiz_prompt_image: 'Which Pokemon is this?',
        quiz_prompt_description_prefix: 'This Pokemon has type:',
        quiz_prompt_suffix: 'Which Pokemon is it?',
        quiz_prompt_type_prefix: 'Which Pokemon has the type:',
        quiz_prompt_silhouette: 'Can you identify this Pokemon from its silhouette?',
        quiz_correct: 'Correct!',
        quiz_points: 'points',
        quiz_wrong: 'Wrong!',
        quiz_times_up: "Time's up!",
        quiz_answer_was: 'The answer was',
        quiz_complete: 'Quiz Complete!',
        quiz_correct_answers: 'Correct Answers',
        quiz_total_questions: 'Total Questions',
        quiz_accuracy: 'Accuracy',
        quiz_final_score: 'Final Score',
        quiz_play_again: 'Play Again',
        quiz_back_home: 'Back to Home',

        // Favorites
        favorites_title: 'My Favorite Pokemon',
        favorites_empty: 'No favorites yet',
        favorites_add_some: 'Add some Pokemon to your favorites!',
        favorites_sort_recent: 'Recently Added',
        favorites_sort_name: 'Name (A-Z)',
        favorites_sort_type: 'Type',
        favorites_added: 'Added',
        favorites_view_details: 'View Details',
        favorites_confirm_clear: 'Are you sure you want to remove all Pokemon from your favorites?',
        favorites_cannot_undo: 'This action cannot be undone.',
        favorites_cancel: 'Cancel',
    },
    ja: {
        // Navigation
        nav_home: 'ホーム',
        nav_compare: '比較',
        nav_quiz: 'クイズ',
        nav_favorites: 'お気に入り',

        // Common actions
        action_back: 'ポケモンリストに戻る',
        action_add_to_comparison: '比較に追加',
        action_remove_from_comparison: '比較から削除',
        action_add_to_favorites: 'お気に入りに追加',
        action_remove_from_favorites: 'お気に入りから削除',
        action_compare: '比較する',
        action_clear_all: 'すべてクリア',
        action_go_back: '戻る',

        // Pokemon Detail
        detail_basic_info: '基本情報',
        detail_height: '高さ',
        detail_weight: '重さ',
        detail_base_experience: '基礎経験値',
        detail_abilities: '特性',
        detail_description: '説明',
        detail_evolution_chain: '進化チェーン',
        detail_stats: 'ステータス',
        detail_moves: 'わざ',
        detail_sprites: 'スプライトギャラリー',
        detail_hidden: '隠れ特性',
        detail_current_pokemon: '現在のポケモン',
        detail_click_to_view: 'クリックして表示',

        // Stats
        stat_hp: 'HP',
        stat_attack: '攻撃',
        stat_defense: '防御',
        stat_special_attack: '特攻',
        stat_special_defense: '特防',
        stat_speed: '素早さ',

        // Messages
        msg_loading: 'ポケモンの詳細を読み込み中...',
        msg_not_found: 'ポケモンが見つかりません',
        msg_no_favorites: 'お気に入りはまだありません',
        msg_add_favorites: 'ポケモンをお気に入りに追加してください！',
        msg_comparison_limit: '最大3匹のポケモンを比較できます',
        msg_comparison_limit_reached: '比較上限に達しました',
        msg_added_to_favorites: 'をお気に入りに追加しました！',
        msg_removed_from_favorites: 'をお気に入りから削除しました',
        msg_no_description: '説明がありません',

        // Search
        search_placeholder: 'ポケモンを検索...',
        search_type_filter: 'タイプで絞り込む',
        search_all_types: 'すべてのタイプ',

        // Grid/Filter Info
        grid_showing: '表示',
        grid_of: '／',
        label_pokemon: 'ポケモン',

        // Pokemon Types
        type_normal: 'ノーマル',
        type_fire: 'ほのお',
        type_water: 'みず',
        type_electric: 'でんき',
        type_grass: 'くさ',
        type_ice: 'こおり',
        type_fighting: 'かくとう',
        type_poison: 'どく',
        type_ground: 'じめん',
        type_flying: 'ひこう',
        type_psychic: 'エスパー',
        type_bug: 'むし',
        type_rock: 'いわ',
        type_ghost: 'ゴースト',
        type_dragon: 'ドラゴン',
        type_dark: 'あく',
        type_steel: 'はがね',
        type_fairy: 'フェアリー',

        // Comparison
        comparison_title: 'ポケモン比較',
        comparison_empty: '比較するポケモンが選択されていません',
        comparison_select: '最大3匹のポケモンを選択して比較',
        comparison_analyzing: 'ポケモンを並べて分析中',
        comparison_selected: 'ポケモン選択済み',
        comparison_add_more: 'さらにポケモンを追加',
        comparison_try_again: '再試行',
        comparison_total_stats: '合計ステータス',
        comparison_average: '平均',
        comparison_types: 'タイプ',

        // Quiz
        quiz_title: 'ポケモンクイズ',
        quiz_title_long: 'ポケモンクイズチャレンジ',
        quiz_subtitle: 'ポケモンの知識を試そう！',
        quiz_choose_challenge: 'チャレンジを選択',
        quiz_game_mode: 'ゲームモード',
        quiz_mode_image: '画像で当てる',
        quiz_mode_description: '説明で当てる',
        quiz_mode_type: 'タイプで当てる',
        quiz_mode_silhouette: 'シルエットで当てる',
        quiz_difficulty_level: '難易度',
        quiz_diff_easy: 'かんたん',
        quiz_diff_medium: 'ふつう',
        quiz_diff_hard: 'むずかしい',
        quiz_questions: '問',
        quiz_seconds_short: '秒',
        quiz_per_question: '毎問',
        quiz_start: 'クイズ開始',
        quiz_question: '問題',
        quiz_of: '全',
        quiz_score_label: 'スコア',
        quiz_loading_title: 'ポケモンクイズを読み込み中...',
        quiz_loading_subtitle: 'ポケモンの冒険を準備中！',
        quiz_loading_progress: 'ポケモンデータを読み込み中...',
        quiz_prompt_image: 'このポケモンは誰？',
        quiz_prompt_description_prefix: 'このポケモンのタイプは',
        quiz_prompt_suffix: 'このポケモンは誰？',
        quiz_prompt_type_prefix: 'どのポケモンのタイプは',
        quiz_prompt_silhouette: 'シルエットからポケモンを当てよう！',
        quiz_correct: '正解！',
        quiz_points: 'ポイント',
        quiz_wrong: '不正解！',
        quiz_times_up: '時間切れ！',
        quiz_answer_was: '正解は',
        quiz_complete: 'クイズ終了！',
        quiz_correct_answers: '正解数',
        quiz_total_questions: '総問題数',
        quiz_accuracy: '正答率',
        quiz_final_score: '最終スコア',
        quiz_play_again: 'もう一度遊ぶ',
        quiz_back_home: 'ホームに戻る',

        // Favorites
        favorites_title: 'お気に入りのポケモン',
        favorites_empty: 'お気に入りはまだありません',
        favorites_add_some: 'ポケモンをお気に入りに追加してください！',
        favorites_sort_recent: '最近追加',
        favorites_sort_name: '名前（A-Z）',
        favorites_sort_type: 'タイプ',
        favorites_added: '追加日',
        favorites_view_details: '詳細を見る',
        favorites_confirm_clear: 'すべてのポケモンをお気に入りから削除してもよろしいですか？',
        favorites_cannot_undo: 'この操作は元に戻せません。',
        favorites_cancel: 'キャンセル',
    }
};

// Language display names
export const LANGUAGE_NAMES = {
    [LANGUAGES.EN]: 'English',
    [LANGUAGES.JA]: '日本語'
};
