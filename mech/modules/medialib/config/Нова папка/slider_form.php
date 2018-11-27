<?php defined('BASEPATH') or exit('No direct script access allowed');

// Navigation
$config['nav'] = [
    ''       => 'Без навігації',
    'arrows' => 'Стрілки',
    'dots'   => 'Крапки',
    'both'   => 'Стрілки та крапки'
];

// Infinite scroll
$config['infinite'] = [
    'type' => 'number',
    'name' => 'joptions[slider][infinite]',
    'min'  => 0
];

// Autocenter
$config['center'] = [
    'type' => 'number',
    'name' => 'joptions[slider][center]',
    'min'  => 0
];

// Autoplay
$config['autoplay'] = [
    'type' => 'number',
    'name' => 'joptions[slider][autoplay]',
    'min'  => 0
];

// Pause on hover
$config['pauseOnHover'] = [
    'type' => 'number',
    'name' => 'joptions[slider][pauseOnHover]',
    'min'  => 0
];

// AutoplayInterval
$config['autoplayInterval'] = [
    'type' => 'number',
    'name' => 'joptions[slider][autoplayInterval]',
    'min'  => 0
];
