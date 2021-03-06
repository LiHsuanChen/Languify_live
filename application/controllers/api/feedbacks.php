<?php // if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require(APPPATH.'/libraries/REST_Controller.php');

class Feedbacks extends REST_Controller {
    
    function __construct() {
        parent::__construct();
        // Autoloaded Config, Helpers, Models
        $this->load->model('feedback');
    }

    // Used to create a new group in the DB
    public function index_post() {
        $this->activity_log->tap('post feedback');
        if ( $this->blacklist->is_clean() ) {
        
            $data = $this->post();
            
            if ( isset($data['message']) ){
                $email = '';
                if ( isset($data['email']) ) {
                    $email = $data['email'];
                } 

                $feedback_id = $this->feedback->create(
                    array(
                        'email' => $email,
                        'ip_address' => $_SERVER['REMOTE_ADDR'],
                        'message' => $data['message']
                    )
                );

                echo json_encode(
                    array(
                        'status' => 'success',
                        'message' => 'Feedback posted successful',
                        'feedback_id' => $feedback_id
                    )
                );
                
            } else {
                echo json_encode( 
                    array(
                        'status'  => 'fail',
                        'message' => 'Message is missing from feedback'
                    )
                );
            }
        } else {
            echo json_encode( 
                array(
                    'status'  => 'fail',
                    'message' => 'You have been blacklisted for spamming'
                )
            );
        }

        return;
    }
}
