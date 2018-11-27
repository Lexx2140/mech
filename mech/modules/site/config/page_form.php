<?php defined('BASEPATH') or exit('No direct script access allowed');

// Pages types
$config['page_types'] = [
    'article'  => 'Стаття',
    'homepage' => 'Головна',
    'static'   => 'Статична',
    'custom'   => 'Custom'
];

// TOP FIRST
$config['items_top'] = [
    'type' => 'number',
    'name' => 'options[items_top]',
    'min'  => 0
];

// Sub items pagination
$config['items_num'] = [
    'type'        => 'number',
    'name'        => 'options[items_num]',
    'min'         => 0,
    'placeholder' => '0 - всі'
];

// Sub items sort
$config['items_sort'] = [
    'sort'    => 'власне',
    'created' => 'за датою створення',
    'updated' => 'за датою оновлення',
    'viewed'  => 'переглядами',
    'title'   => 'назвою'
];

// Sub items sort direction
$config['items_sort_dir'] = [
    'asc'  => 'за зростанням',
    'desc' => 'за спаданням'
];

// Sub pages image width
$config['subs_img_w'] = [
    'type'        => 'number',
    'name'        => 'options[img_w]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Sub pages image height
$config['subs_img_h'] = [
    'type'        => 'number',
    'name'        => 'options[img_h]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Sub pages thumb width
$config['subs_thumb_w'] = [
    'type'        => 'number',
    'name'        => 'options[thumb_w]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Sub pages thumb height
$config['subs_thumb_h'] = [
    'type'        => 'number',
    'name'        => 'options[thumb_h]',
    'min'         => 0,
    'placeholder' => 'auto'
];

// Allied categories pages num
$config['allied_num'] = [
    'type' => 'number',
    'name' => 'options[allied_num]',
    'min'  => 0
];
