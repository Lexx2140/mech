<?php defined('BASEPATH') or exit('No direct script access allowed');

// Library type
$config['lib_type'] = [
    'grid'      => 'Сітка',
    'slider'    => 'Слайдер',
    'slideshow' => 'Слайдшоу',
    'list'      => 'Список',
    'files'     => 'Окремі файли'
];

// Media type
$config['src'] = [
    'file' => 'Файл',
    'icon' => 'Іконка',
    'url'  => 'Посилання'
];

// Sub items sort
$config['items_sort'] = [
    'sort'    => 'власне',
    'created' => 'за датою створення',
    'updated' => 'за датою оновлення'
];

// Sub items sort direction
$config['items_sort_dir'] = [
    'asc'  => 'за зростанням',
    'desc' => 'за спаданням'
];

// Text align
$config['align'] = [
    'left'    => 'Зліва',
    'center'  => 'По центру',
    'right'   => 'Зправа',
    'justify' => 'По ширині'
];

// Items image width
$config['subs_img_w'] = [
    'type'        => 'number',
    'name'        => 'options[img_w]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Items image height
$config['subs_img_h'] = [
    'type'        => 'number',
    'name'        => 'options[img_h]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Items thumb width
$config['subs_thumb_w'] = [
    'type'        => 'number',
    'name'        => 'options[thumb_w]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Items thumb height
$config['subs_thumb_h'] = [
    'type'        => 'number',
    'name'        => 'options[thumb_h]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Figure form (rounded, circle, rectangle)
$config['rounded'] = [
    ''                  => 'Звичайна',
    'uk-border-rounded' => 'Заокруглена',
    'uk-border-circle'  => 'Кругла'
];

// Overlay effect (images only)
$config['overlay_effect'] = [
    ''                        => '---',
    'uk-overlay-fade'         => 'Fade',
    'uk-overlay-scale'        => 'Scale',
    'uk-overlay-spin'         => 'Spin',
    'uk-overlay-grayscale'    => 'Grayscale',
    'uk-overlay-slide-right'  => 'Slide right',
    'uk-overlay-slide-left'   => 'Slide left',
    'uk-overlay-slide-top'    => 'Slide top',
    'uk-overlay-slide-bottom' => 'Slide bottom'
];

// Overlay position
$config['position'] = [
    'uk-flex uk-flex-center uk-flex-middle uk-text-center' => 'По центру',
    'uk-overlay-top'                                       => 'Вгорі',
    'uk-overlay-bottom'                                    => 'Внизу',
    'uk-overlay-left'                                      => 'Зліва',
    'uk-overlay-right'                                     => 'Зправа'
];

// Overlay on hover
$config['overlay'] = [
    ''                            => 'Ні',
    'uk-overlay'                  => 'Так',
    'uk-overlay uk-overlay-hover' => 'При наведенні'
];

// Background overlay on hover
$config['bg_overlay'] = [
    'uk-overlay-background' => 'Так',
    ''                      => 'Ні'
];

// Grid gutter
$config['gutter'] = [
    ''                 => 'Стандартний',
    'uk-grid-collapse' => 'Без відступу',
    'uk-grid-small'    => 'Маленький',
    'uk-grid-large'    => 'Великий'
];
