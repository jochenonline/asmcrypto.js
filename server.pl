#!/usr/bin/env perl
use Mojolicious::Lite;

get '/' => sub {
    my $self = shift;
    $self->redirect_to('test.html');
};

@{app->static->paths} = '.';

app->start;
