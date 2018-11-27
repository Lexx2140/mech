<?php defined('BASEPATH') or exit('No direct script access allowed');

### AT LEAST ONE LANGUAGE MUST BE SET

// Country
$config['country'] = 'UA';

// Multilanguage
$config['multilang'] = '0';

// Default/ primary language
$config['def_lang'] = [
  'id'    => 1,
  'name'  => 'ukrainian',
  'title' => 'Українська',
  'code'  => 'uk',
  'slug'  => 'ua'
];

// Languages list
$config['langs'] = [

    'ua' => [
        'id'    => 1,
        'name'  => 'ukrainian',
        'title' => 'Українська',
        'code'  => 'uk',
        'slug'  => 'ua'
    ],

    'ru' => [
        'id'    => 2,
        'name'  => 'russian',
        'title' => 'Русский',
        'code'  => 'ru',
        'slug'  => 'ru'
    ]
];
