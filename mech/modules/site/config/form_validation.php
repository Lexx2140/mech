<?php defined('BASEPATH') or exit('No direct script access allowed');

$config = array(
    'category_val' => array(
        array(
            'field' => 'name',
            'label' => 'URL',
            'rules' => 'required|regex_match[/^[a-z0-9-_\/]+$/]|min_length[3]'
        )
    ),

    'page_val'     => array(
        array(
            'field' => 'name',
            'label' => 'URL',
            'rules' => 'required|regex_match[/^[a-z0-9-_\/]+$/]|min_length[3]'
        )
    )
);
