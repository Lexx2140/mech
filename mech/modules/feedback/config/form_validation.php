<?php defined('BASEPATH') or exit('No direct script access allowed');

$config = [
    'simple' => [
        array(
            'field' => 'name',
            'label' => 'Ім’я',
            'rules' => 'trim|required|min_length[3]'
        ),
        array(
            'field' => 'email',
            'label' => 'E-mail',
            'rules' => 'trim|required|valid_email'
        )
    ],

    'order'  => [
        array(
            'field' => 'name',
            'label' => 'Ім’я',
            'rules' => 'trim|required|min_length[3]'
        ),
        array(
            'field' => 'email',
            'label' => 'E-mail',
            'rules' => 'trim|required|valid_email'
        ),
        array(
            'field' => 'tel',
            'label' => 'Контактний телефон',
            'rules' => 'trim|required'
        )
    ]
];
