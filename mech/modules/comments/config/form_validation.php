<?php defined('BASEPATH') or exit('No direct script access allowed');

$config = [
    array(
        'field' => 'user_name',
        'label' => 'Ім’я',
        'rules' => 'trim|required|min_length[3]'
    ),
    array(
        'field' => 'user_email',
        'label' => 'E-mail',
        'rules' => 'trim|required|valid_email'
    ),
    array(
        'field' => 'msg',
        'label' => 'Коментар',
        'rules' => 'required|max_length[500]'
    )
];
