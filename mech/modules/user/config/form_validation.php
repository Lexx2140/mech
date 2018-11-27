<?php defined('BASEPATH') or exit('No direct script access allowed');

$config = array(
    'parent_val' => array(
        array(
            'field' => 'title',
            'label' => 'Заголовок',
            'rules' => 'required'
        )
    ),
    'item_val' => array(
        array(
            'field' => 'login',
            'label' => 'Логін',
            'rules' => 'required'
        ),
        array(
            'field' => 'email',
            'label' => 'E-mail',
            'rules' => 'required'
        )
    )
);
