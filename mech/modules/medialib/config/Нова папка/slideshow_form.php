<?php defined('BASEPATH') or exit('No direct script access allowed');

// Navigation
$config['nav'] = [
    ''       => 'Без навігації',
    'arrows' => 'Стрілки',
    'dots'   => 'Крапки',
    'both'   => 'Стрілки та крапки'
];

// AutoplayInterval
$config['autoplayInterval'] = [
    'type' => 'number',
    'name' => 'joptions[slideshow][autoplayInterval]',
    'min'  => 0
];

// Duration
$config['duration'] = [
    'type' => 'number',
    'name' => 'joptions[slideshow][duration]',
    'min'  => 0
];

// Duration
$config['kenburns'] = [
    'type'        => 'text',
    'name'        => 'joptions[slideshow][kenburns]',
    'placeholder' => 'true/false/час в мс'
];
